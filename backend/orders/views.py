import threading
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
        payment_label = {'stripe': 'Stripe', 'paypal': 'PayPal'}.get(order.payment_method, order.payment_method)
        delivery_info += f"\nPayment method: {payment_label} — our team will send you a secure payment link shortly."

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

        # Calculate total (skip price-on-request items)
        total = sum(
            item.product.price * item.quantity
            for item in cart_items
            if item.product.price is not None
        )

        order = Order.objects.create(
            user=request.user,
            total_amount=total,
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

        cart.items.all().delete()

        threading.Thread(target=_send_order_emails, args=(order.id,), daemon=True).start()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
