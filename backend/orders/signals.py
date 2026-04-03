import logging
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

STATUS_LABELS = {
    'pending':   'Pending',
    'confirmed': 'Confirmed',
    'shipped':   'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
}

STATUS_MESSAGES = {
    'confirmed': 'Your order has been confirmed and is being prepared.',
    'delivered': 'Your order has been delivered. We hope you love your jewellery!',
    'cancelled': 'Your order has been cancelled. Please contact us if you have any questions.',
}

ROYAL_MAIL_TRACKING_URL = 'https://www.royalmail.com/track-your-item#/tracking-results/{}'


@receiver(pre_save, sender='orders.Order')
def notify_customer_on_status_change(sender, instance, **kwargs):
    """Send customer an email whenever an admin changes the order status or tracking number."""
    if not instance.pk:
        return  # new order — confirmation email is sent by the view

    try:
        previous = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    status_changed = previous.status != instance.status
    tracking_added = (
        instance.tracking_number
        and previous.tracking_number != instance.tracking_number
    )

    # Shipped status — include tracking number if present
    if status_changed and instance.status == 'shipped':
        _send_shipped_email(instance)
        return

    # Tracking number added/updated on an already-shipped order without a status change
    if tracking_added and not status_changed and instance.status == 'shipped':
        _send_tracking_update_email(instance)
        return

    # Any other status change
    if status_changed:
        _send_status_email(instance)


def _send_shipped_email(order):
    customer = order.user
    customer_name = f"{customer.first_name} {customer.last_name}".strip() or customer.email

    tracking_section = ''
    if order.tracking_number:
        tracking_url = ROYAL_MAIL_TRACKING_URL.format(order.tracking_number)
        tracking_section = (
            f'\nYour Royal Mail tracking number is: {order.tracking_number}\n'
            f'Track your parcel here: {tracking_url}\n'
        )

    subject = f'Order #{order.id} — Your order is on its way! | Naresh Jewellers'
    body = (
        f'Dear {customer_name},\n\n'
        f'Great news — your order has been shipped and is on its way to you!\n'
        f'{tracking_section}\n'
        f'Order #{order.id}\n\n'
        f'If you have any questions, please call us on 0121 558 6966 or reply to this email.\n\n'
        f'Warm regards,\nNaresh Jewellers\n4 High St, Smethwick B66 1DX\nTel: 0121 558 6966'
    )
    _send(subject, body, customer.email, order.id)


def _send_tracking_update_email(order):
    customer = order.user
    customer_name = f"{customer.first_name} {customer.last_name}".strip() or customer.email
    tracking_url = ROYAL_MAIL_TRACKING_URL.format(order.tracking_number)

    subject = f'Order #{order.id} — Tracking number updated | Naresh Jewellers'
    body = (
        f'Dear {customer_name},\n\n'
        f'Your Royal Mail tracking number for Order #{order.id} has been updated.\n\n'
        f'Tracking number: {order.tracking_number}\n'
        f'Track your parcel here: {tracking_url}\n\n'
        f'If you have any questions, please call us on 0121 558 6966 or reply to this email.\n\n'
        f'Warm regards,\nNaresh Jewellers\n4 High St, Smethwick B66 1DX\nTel: 0121 558 6966'
    )
    _send(subject, body, customer.email, order.id)


def _send_status_email(order):
    customer = order.user
    customer_name = f"{customer.first_name} {customer.last_name}".strip() or customer.email
    new_status_label = STATUS_LABELS.get(order.status, order.status.title())
    status_message = STATUS_MESSAGES.get(
        order.status,
        f'Your order status has been updated to: {new_status_label}.'
    )

    subject = f'Order #{order.id} Update — {new_status_label} | Naresh Jewellers'
    body = (
        f'Dear {customer_name},\n\n'
        f'{status_message}\n\n'
        f'Order #{order.id}\nStatus: {new_status_label}\n\n'
        f'If you have any questions, please call us on 0121 558 6966 or reply to this email.\n\n'
        f'Warm regards,\nNaresh Jewellers\n4 High St, Smethwick B66 1DX\nTel: 0121 558 6966'
    )
    _send(subject, body, customer.email, order.id)


def _send(subject, body, recipient, order_id):
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [recipient])
        logger.info('Order #%s email sent to %s — "%s"', order_id, recipient, subject)
    except Exception as e:
        logger.error('Failed to send email for order #%s: %s', order_id, e)
