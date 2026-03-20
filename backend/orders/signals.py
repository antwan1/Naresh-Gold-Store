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
    'shipped':   'Great news — your order is on its way!',
    'delivered': 'Your order has been delivered. We hope you love your jewellery!',
    'cancelled': 'Your order has been cancelled. Please contact us if you have any questions.',
}


@receiver(pre_save, sender='orders.Order')
def notify_customer_on_status_change(sender, instance, **kwargs):
    """Send customer an email whenever an admin changes the order status."""
    if not instance.pk:
        return  # new order, not a status change

    try:
        previous = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    if previous.status == instance.status:
        return  # no change

    customer = instance.user
    customer_name = f"{customer.first_name} {customer.last_name}".strip() or customer.email
    new_status_label = STATUS_LABELS.get(instance.status, instance.status.title())
    status_message = STATUS_MESSAGES.get(
        instance.status,
        f'Your order status has been updated to: {new_status_label}.'
    )

    subject = f'Order #{instance.id} Update — {new_status_label} | Naresh Jewellers'
    body = (
        f'Dear {customer_name},\n\n'
        f'{status_message}\n\n'
        f'Order #{instance.id}\n'
        f'Status: {new_status_label}\n\n'
        f'If you have any questions, please call us on 0121 558 6966 or reply to this email.\n\n'
        f'Warm regards,\n'
        f'Naresh Jewellers\n'
        f'4 High St, Smethwick B66 1DX\n'
        f'Tel: 0121 558 6966'
    )

    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [customer.email])
        logger.info('Order #%s status email sent to %s (%s)', instance.id, customer.email, new_status_label)
    except Exception as e:
        logger.error('Failed to send order status email for order #%s: %s', instance.id, e)
