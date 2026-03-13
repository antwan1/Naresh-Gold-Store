from rest_framework import generics
from django.core.mail import send_mail
from django.conf import settings
from .models import GoldBuyback
from .serializers import GoldBuybackSerializer


class GoldBuybackCreateView(generics.CreateAPIView):
    serializer_class = GoldBuybackSerializer
    authentication_classes = []
    permission_classes = []

    def perform_create(self, serializer):
        buyback = serializer.save()
        self._send_confirmation(buyback)
        self._send_shop_notification(buyback)

    def _send_confirmation(self, buyback: GoldBuyback):
        subject = 'We received your gold selling request — Naresh Jewellers'
        body = (
            f'Dear {buyback.name},\n\n'
            f'Thank you for getting in touch with Naresh Jewellers. '
            f'We have received your request to sell your gold and will be in touch shortly.\n\n'
            f'Your submission:\n'
            f'  Item type:  {buyback.get_item_type_display()}\n'
            f'  Purity:     {buyback.get_purity_display()}\n'
        )
        if buyback.estimated_weight:
            body += f'  Weight:     {buyback.estimated_weight}\n'
        if buyback.description:
            body += f'  Notes:      {buyback.description}\n'
        body += (
            f'\nIf you have any questions, please call us on 0121 558 6966.\n\n'
            f'Warm regards,\n'
            f'Naresh Jewellers\n'
            f'4 Smethwick High Street, Birmingham, B66 1DX'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [buyback.email], fail_silently=True)
        except Exception:
            pass

    def _send_shop_notification(self, buyback: GoldBuyback):
        subject = f'New gold buying request from {buyback.name}'
        body = (
            f'A new gold selling request has been submitted.\n\n'
            f'  Name:       {buyback.name}\n'
            f'  Email:      {buyback.email}\n'
            f'  Phone:      {buyback.phone}\n'
            f'  Item type:  {buyback.get_item_type_display()}\n'
            f'  Purity:     {buyback.get_purity_display()}\n'
        )
        if buyback.estimated_weight:
            body += f'  Weight:     {buyback.estimated_weight}\n'
        if buyback.description:
            body += f'  Notes:      {buyback.description}\n'
        body += (
            f'\nManage requests in the admin:\n'
            f'http://localhost:8000/admin/buyback/goldbuyback/\n'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [settings.SHOP_EMAIL], fail_silently=True)
        except Exception:
            pass
