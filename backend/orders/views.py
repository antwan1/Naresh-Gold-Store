import threading
import stripe
from django.core.mail import send_mail
from django.conf import settings as django_settings
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartSerializer, CartItemSerializer, OrderSerializer, PlaceOrderSerializer
)


def _send_order_emails(order_id):
    """Send confirmation emails to customer and shop — runs in background thread."""
    from .models import Order  # avoid circular import at module level
    try:
        order = Order.objects.prefetch_related('items__product').get(pk=order_id)
    except Order.DoesNotExist:
        return

    customer = order.user
    customer_name = f"{customer.first_name} {customer.last_name}".strip() or customer.email

    items_text = "\n".join(
        f"  • {item.product.name} × {item.quantity}  —  £{item.total_price}"
        for item in order.items.all()
    )

    if order.payment_method == 'cash':
        delivery_info = "Payment & Collection: Cash on Collection — we will contact you to arrange a convenient time."
        phone_line = f"Contact phone: {order.contact_phone}" if order.contact_phone else ""
    else:
        addr_parts = [
            order.shipping_address_line1,
            order.shipping_address_line2,
            order.shipping_city,
            order.shipping_postcode,
            order.shipping_country,
        ]
        address_str = ", ".join(p for p in addr_parts if p)
        delivery_info = f"Shipping to: {address_str}"
        phone_line = f"Contact phone: {order.contact_phone}" if order.contact_phone else ""
        delivery_info += "\nPayment: Card payment received via Stripe — your payment has been confirmed."

    # ── Customer confirmation ───────────────────────────────────────────────
    send_mail(
        subject=f"Order Confirmed — Naresh Jewellers (Order #{order.id})",
        message=f"""Dear {customer_name},

Thank you for placing an order with Naresh Jewellers!

───────────────────────────
Order #{order.id}
───────────────────────────
{items_text}

Total: £{order.total_amount}

{delivery_info}

{"Notes: " + order.notes if order.notes else ""}

We will be in touch shortly to confirm the next steps.

Warm regards,
Naresh Jewellers
4 Smethwick High Street, Birmingham, B66 1DX
Tel: 0121 558 6966
""",
        from_email=django_settings.DEFAULT_FROM_EMAIL,
        recipient_list=[customer.email],
        fail_silently=True,
    )

    # ── Shop notification ───────────────────────────────────────────────────
    send_mail(
        subject=f"New Order #{order.id} — {customer_name}",
        message=f"""A new order has been placed on Naresh Jewellers.

Customer: {customer_name}
Email: {customer.email}
{phone_line}

───────────────────────────
Order #{order.id}
───────────────────────────
{items_text}

Total: £{order.total_amount}

{delivery_info}

{"Notes: " + order.notes if order.notes else ""}

View in admin: http://localhost:8000/admin/orders/order/{order.id}/change/
""",
        from_email=django_settings.DEFAULT_FROM_EMAIL,
        recipient_list=[django_settings.SHOP_EMAIL],
        fail_silently=True,
    )


class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_cart(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def list(self, request):
        cart = self.get_cart()
        return Response(CartSerializer(cart).data)

    def create(self, request):
        cart = self.get_cart()
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'error': 'product is required'}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            defaults={'quantity': quantity},
        )
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        cart = self.get_cart()
        try:
            item = cart.items.get(pk=pk)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        if quantity < 1:
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        item.quantity = quantity
        item.save()
        return Response(CartItemSerializer(item).data)

    def destroy(self, request, pk=None):
        cart = self.get_cart()
        try:
            item = cart.items.get(pk=pk)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
                   mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # each user has few orders, no need to paginate

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

    def create(self, request, *args, **kwargs):
        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.select_related('product').all()

        if not cart_items.exists():
            return Response(
                {'error': 'Your cart is empty'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate stock before creating anything
        out_of_stock = [
            item.product.name
            for item in cart_items
            if item.product.stock_quantity < item.quantity
        ]
        if out_of_stock:
            return Response(
                {'error': f"Insufficient stock for: {', '.join(out_of_stock)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate total (skip price-on-request items)
        shipping_cost = serializer.validated_data.get('shipping_cost', 0)
        total = sum(
            item.product.price * item.quantity
            for item in cart_items
            if item.product.price is not None
        ) + shipping_cost

        from decimal import Decimal
        commission_rate = Decimal('0.0300')
        commission_amount = (Decimal(str(total)) * commission_rate).quantize(Decimal('0.01'))

        order = Order.objects.create(
            user=request.user,
            total_amount=total,
            commission_rate=commission_rate,
            commission_amount=commission_amount,
            **serializer.validated_data,
        )

        for item in cart_items:
            unit_price = item.product.price or 0
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                unit_price=unit_price,
                total_price=unit_price * item.quantity,
            )
            # Decrement stock
            item.product.stock_quantity = max(0, item.product.stock_quantity - item.quantity)
            item.product.save(update_fields=['stock_quantity'])

        cart.items.all().delete()

        # For cash orders, email immediately. For Stripe, email after payment is confirmed.
        if order.payment_method == 'cash':
            threading.Thread(target=_send_order_emails, args=(order.id,), daemon=True).start()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='create-stripe-session')
    def create_stripe_session(self, request, pk=None):
        order = self.get_object()
        if order.payment_method != 'stripe':
            return Response({'error': 'Not a Stripe order'}, status=status.HTTP_400_BAD_REQUEST)

        stripe.api_key = django_settings.STRIPE_SECRET_KEY
        frontend_url = django_settings.FRONTEND_URL

        line_items = []
        for item in order.items.select_related('product').all():
            line_items.append({
                'price_data': {
                    'currency': 'gbp',
                    'product_data': {'name': item.product.name},
                    'unit_amount': int(item.unit_price * 100),
                },
                'quantity': item.quantity,
            })

        if order.shipping_cost:
            line_items.append({
                'price_data': {
                    'currency': 'gbp',
                    'product_data': {'name': 'Shipping'},
                    'unit_amount': int(order.shipping_cost * 100),
                },
                'quantity': 1,
            })

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            customer_email=request.user.email,
            success_url=f"{frontend_url}/order-confirmation/{order.id}?stripe_session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_url}/checkout",
            metadata={'order_id': str(order.id)},
        )
        return Response({'url': session.url})

    @action(detail=True, methods=['post'], url_path='confirm-stripe')
    def confirm_stripe(self, request, pk=None):
        order = self.get_object()
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'Missing session_id'}, status=status.HTTP_400_BAD_REQUEST)

        stripe.api_key = django_settings.STRIPE_SECRET_KEY
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if (session.payment_status == 'paid'
                    and str(session.metadata.get('order_id')) == str(order.id)):
                order.status = 'confirmed'
                order.save()
                threading.Thread(target=_send_order_emails, args=(order.id,), daemon=True).start()
                return Response({'status': 'confirmed'})
            return Response({'error': 'Payment not confirmed'}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
