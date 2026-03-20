import logging
from rest_framework import generics
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomOrderEnquiry
from .serializers import CustomOrderEnquirySerializer

logger = logging.getLogger(__name__)


class CustomOrderEnquiryCreateView(generics.CreateAPIView):
    serializer_class = CustomOrderEnquirySerializer
    authentication_classes = []
    permission_classes = []

    def perform_create(self, serializer):
        enquiry = serializer.save()
        self._send_confirmation(enquiry)
        self._send_shop_notification(enquiry)

    def _send_confirmation(self, enquiry: CustomOrderEnquiry):
        subject = 'Your bespoke jewellery enquiry — Naresh Jewellers'
        body = (
            f'Dear {enquiry.name},\n\n'
            f'Thank you for your bespoke jewellery enquiry. '
            f'We have received your request and our craftsmen will review it carefully.\n\n'
            f'Your request:\n'
            f'  Piece: {enquiry.get_piece_type_display()}\n'
            f'  Metal: {enquiry.get_metal_display()}\n'
            f'  Budget: {enquiry.get_budget_display()}\n'
        )
        if enquiry.occasion:
            body += f'  Occasion: {enquiry.occasion}\n'
        body += (
            f'\nYour description:\n"{enquiry.description}"\n\n'
            f'We will be in touch within 2 business days to discuss your vision.\n\n'
            f'If your matter is urgent, please call us on 0121 558 6966.\n\n'
            f'Warm regards,\n'
            f'Naresh Jewellers\n'
            f'4 High St, Smethwick B66 1DX'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [enquiry.email])
        except Exception as e:
            logger.error('Failed to send custom order confirmation to %s: %s', enquiry.email, e)

    def _send_shop_notification(self, enquiry: CustomOrderEnquiry):
        subject = f'New bespoke order enquiry from {enquiry.name}'
        body = (
            f'A new custom jewellery enquiry has been submitted.\n\n'
            f'  Name:    {enquiry.name}\n'
            f'  Email:   {enquiry.email}\n'
            f'  Phone:   {enquiry.phone or "not provided"}\n'
            f'  Piece:   {enquiry.get_piece_type_display()}\n'
            f'  Metal:   {enquiry.get_metal_display()}\n'
            f'  Budget:  {enquiry.get_budget_display()}\n'
        )
        if enquiry.occasion:
            body += f'  Occasion: {enquiry.occasion}\n'
        body += (
            f'\nDescription:\n{enquiry.description}\n\n'
            f'Manage in admin:\n'
            f'https://naresh-gold-store.onrender.com/admin/custom_orders/customorderenquiry/\n'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [settings.SHOP_EMAIL])
        except Exception as e:
            logger.error('Failed to send custom order shop notification: %s', e)
