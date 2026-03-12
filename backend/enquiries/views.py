from rest_framework import generics
from django.core.mail import send_mail
from django.conf import settings
from .models import Enquiry
from .serializers import EnquirySerializer


class EnquiryCreateView(generics.CreateAPIView):
    serializer_class = EnquirySerializer
    authentication_classes = []
    permission_classes = []

    def perform_create(self, serializer):
        enquiry = serializer.save()
        self._send_confirmation(enquiry)
        self._send_shop_notification(enquiry)

    def _send_confirmation(self, enquiry: Enquiry):
        subject = 'We received your enquiry — Naresh Jewellers'
        body = (
            f'Dear {enquiry.name},\n\n'
            f'Thank you for getting in touch with Naresh Jewellers. '
            f'We have received your message and will get back to you as soon as possible.\n\n'
        )
        if enquiry.product:
            body += f'You enquired about: {enquiry.product.name}\n\n'
        body += (
            f'Your message:\n"{enquiry.message}"\n\n'
            f'If your matter is urgent, please call us on +44 121 700 1234.\n\n'
            f'Warm regards,\n'
            f'Naresh Jewellers\n'
            f'123 Jewellers Row, Birmingham, B18 6NF'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [enquiry.email], fail_silently=True)
        except Exception:
            pass

    def _send_shop_notification(self, enquiry: Enquiry):
        product_info = f'\n  Product: {enquiry.product.name}' if enquiry.product else ''
        subject = f'New enquiry from {enquiry.name}'
        body = (
            f'A new enquiry has been submitted.\n\n'
            f'  Name:    {enquiry.name}\n'
            f'  Email:   {enquiry.email}\n'
            f'  Phone:   {enquiry.phone or "not provided"}\n'
            f'{product_info}\n\n'
            f'Message:\n{enquiry.message}\n\n'
            f'Manage enquiries in the admin:\n'
            f'http://localhost:8000/admin/enquiries/enquiry/\n'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [settings.SHOP_EMAIL], fail_silently=True)
        except Exception:
            pass
