import logging
from rest_framework import generics
from django.core.mail import send_mail
from django.conf import settings
from .models import Appointment
from .serializers import AppointmentSerializer

logger = logging.getLogger(__name__)

PURPOSE_LABELS = {
    'consultation': 'Consultation',
    'repair': 'Repair',
    'valuation': 'Valuation',
    'general': 'General Enquiry',
}


class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    authentication_classes = []
    permission_classes = []

    def perform_create(self, serializer):
        appointment = serializer.save()
        self._send_confirmation(appointment)
        self._send_shop_notification(appointment)

    def _send_confirmation(self, appt: Appointment):
        purpose = PURPOSE_LABELS.get(appt.purpose, appt.purpose.title())
        subject = 'Your appointment at Naresh Jewellers is confirmed'
        body = (
            f'Dear {appt.name},\n\n'
            f'Thank you for booking a visit with us. Here are your details:\n\n'
            f'  Date:    {appt.date.strftime("%A, %d %B %Y")}\n'
            f'  Time:    {appt.time_slot}\n'
            f'  Purpose: {purpose}\n\n'
            f'Our address:\n'
            f'  4 High St, Smethwick B66 1DX\n\n'
            f'If you need to change or cancel your appointment, please call us on\n'
            f'0121 558 6966 or reply to this email.\n\n'
            f'We look forward to seeing you.\n\n'
            f'Warm regards,\n'
            f'Naresh Jewellers'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [appt.email])
        except Exception as e:
            logger.error('Failed to send appointment confirmation to %s: %s', appt.email, e)

    def _send_shop_notification(self, appt: Appointment):
        purpose = PURPOSE_LABELS.get(appt.purpose, appt.purpose.title())
        subject = f'New appointment: {appt.name} — {appt.date} {appt.time_slot}'
        body = (
            f'A new appointment has been booked.\n\n'
            f'  Name:    {appt.name}\n'
            f'  Email:   {appt.email}\n'
            f'  Phone:   {appt.phone}\n'
            f'  Date:    {appt.date.strftime("%A, %d %B %Y")}\n'
            f'  Time:    {appt.time_slot}\n'
            f'  Purpose: {purpose}\n\n'
            f'Manage appointments in the admin:\n'
            f'https://naresh-gold-store.onrender.com/admin/appointments/appointment/\n'
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [settings.SHOP_EMAIL])
        except Exception as e:
            logger.error('Failed to send appointment shop notification: %s', e)
