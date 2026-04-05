import logging
import stripe
from django.core.mail import send_mail
from django.conf import settings as django_settings
from django.db import transaction

logger = logging.getLogger(__name__)
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartSerializer, CartItemSerializer, OrderSerializer, PlaceOrderSerializer
)


def _send_order_emails(order_id):
    """Send confirmation emails to customer and shop."""
    from .models import Order  # avoid circular import at module level
    try:
        order = Order.objects.prefetch_related('items__product').get(pk=order_id)
        _do_send_order_emails(order)
    except Exception as e:
        logger.error('Failed to send order emails for order #%s: %s', order_id, e, exc_info=True)


def _do_send_order_emails(order):

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

    notes_line = f"Notes: {order.notes}\n" if order.notes else ""

    # ── Customer confirmation ───────────────────────────────────────────────
    send_mail(
        subject=f"Order Confirmed — Naresh Jewellers (Order #{order.id})",
        message=f"""Dear {customer_name},

Thank you for placing an order with Naresh Jewellers! We are delighted to serve you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER #{order.id} — INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
{items_text}

Subtotal:  £{order.total_amount}
Shipping:  £{order.shipping_cost if order.shipping_cost else '0.00'}
─────────────────────────────
TOTAL:     £{order.total_amount}

{delivery_info}

{notes_line}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEED HELP WITH YOUR ORDER?
━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Cancel or request a refund
  Reply to this email with the subject "CANCEL #{order.id}" or
  call us on 0121 558 6966. Orders can be cancelled before dispatch.

• Returns & refunds
  We accept returns within 14 days of delivery. Items must be
  unworn and in original condition. Reply to this email to start
  a return.

• General support
  Email: info@nareshjewellers.co.uk
  Phone: 0121 558 6966
  Mon–Sun: 11:00–18:00

We will be in touch shortly to confirm the next steps.

Warm regards,
Naresh Jewellers
4 High St, Smethwick B66 1DX
Tel: 0121 558 6966
""",
        from_email=django_settings.DEFAULT_FROM_EMAIL,
        recipient_list=[customer.email],
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

View in admin: https://naresh-gold-store.onrender.com/admin/orders/order/{order.id}/change/
""",
        from_email=django_settings.DEFAULT_FROM_EMAIL,
        recipient_list=[django_settings.SHOP_EMAIL],
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

        # Calculate total using live price where available, otherwise static price
        from decimal import Decimal
        from core.gold_price import live_price_for_product

        validated = serializer.validated_data
        shipping_cost = Decimal(str(validated.get('shipping_cost', 0)))

        item_prices = {}
        for item in cart_items:
            live = live_price_for_product(
                item.product.metal_type, item.product.purity,
                item.product.weight_grams, item.product.making_charge,
            )
            if live is not None:
                item_prices[item.id] = Decimal(str(live))
            elif item.product.price is not None:
                item_prices[item.id] = Decimal(str(item.product.price))

        items_total = sum(
            item_prices.get(item.id, Decimal('0')) * item.quantity
            for item in cart_items
        )
        total = items_total + shipping_cost

        commission_rate = Decimal('0.0300')
        commission_amount = (total * commission_rate).quantize(Decimal('0.01'))

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                total_amount=total,
                commission_rate=commission_rate,
                commission_amount=commission_amount,
                payment_method=validated['payment_method'],
                contact_phone=validated.get('contact_phone', ''),
                recipient_name=validated.get('recipient_name', ''),
                shipping_cost=shipping_cost,
                shipping_address_line1=validated.get('shipping_address_line1', ''),
                shipping_address_line2=validated.get('shipping_address_line2', ''),
                shipping_city=validated.get('shipping_city', ''),
                shipping_postcode=validated.get('shipping_postcode', ''),
                shipping_country=validated.get('shipping_country', ''),
                notes=validated.get('notes', ''),
            )

            for item in cart_items:
                unit_price = item_prices.get(item.id, Decimal('0'))
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

            # For cash orders clear the cart now; for Stripe keep cart items until
        # payment is confirmed so the user can press back and try again.
        if order.payment_method == 'cash':
            cart.items.all().delete()
            _send_order_emails(order.id)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status == 'delivered':
            return Response(
                {'error': 'Delivered orders cannot be cancelled. Please contact us to arrange a return.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if order.status == 'cancelled':
            return Response({'error': 'Order is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'cancelled'
        order.save()  # triggers signal → sends cancellation/refund email
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['post'], url_path='create-stripe-session')
    def create_stripe_session(self, request, pk=None):
        order = self.get_object()
        if order.payment_method != 'stripe':
            return Response({'error': 'Not a Stripe order'}, status=status.HTTP_400_BAD_REQUEST)

        if not django_settings.STRIPE_SECRET_KEY:
            logger.error('STRIPE_SECRET_KEY is not configured')
            return Response({'error': 'Payment processing is not configured. Please contact us.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            stripe.api_key = django_settings.STRIPE_SECRET_KEY
            frontend_url = django_settings.FRONTEND_URL

            line_items = []
            for item in order.items.select_related('product').all():
                unit_pence = round(float(item.unit_price) * 100)
                if unit_pence > 0:
                    line_items.append({
                        'price_data': {
                            'currency': 'gbp',
                            'product_data': {'name': item.product.name},
                            'unit_amount': unit_pence,
                        },
                        'quantity': item.quantity,
                    })

            if order.shipping_cost:
                shipping_pence = round(float(order.shipping_cost) * 100)
                if shipping_pence > 0:
                    line_items.append({
                        'price_data': {
                            'currency': 'gbp',
                            'product_data': {'name': 'Shipping'},
                            'unit_amount': shipping_pence,
                        },
                        'quantity': 1,
                    })

            if not line_items:
                return Response({'error': 'Order has no chargeable items.'}, status=status.HTTP_400_BAD_REQUEST)

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
        except Exception as e:
            logger.error('Stripe session creation failed for order #%s: %s', order.id, e)
            return Response({'error': f'Payment session failed: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='confirm-stripe')
    def confirm_stripe(self, request, pk=None):
        order = self.get_object()

        # Idempotent: already confirmed (e.g. page refresh) — just clear cart & return
        if order.status == 'confirmed':
            cart, _ = Cart.objects.get_or_create(user=request.user)
            cart.items.all().delete()
            return Response({'status': 'confirmed'})

        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'Missing session_id'}, status=status.HTTP_400_BAD_REQUEST)

        stripe.api_key = django_settings.STRIPE_SECRET_KEY
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            # order.id comes from the authenticated URL — no need to cross-check metadata
            if session.payment_status == 'paid':
                Order.objects.filter(pk=order.pk).update(status='confirmed')
                cart, _ = Cart.objects.get_or_create(user=request.user)
                cart.items.all().delete()
                _send_order_emails(order.id)
                return Response({'status': 'confirmed'})
            return Response({'error': 'Payment not confirmed'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error('Stripe confirmation error for order #%s: %s', order.id, e, exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
