"""Management command to test email configuration from the Render shell."""
from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Send a test email to verify SMTP configuration'

    def add_arguments(self, parser):
        parser.add_argument('recipient', help='Email address to send the test to')

    def handle(self, *args, **options):
        recipient = options['recipient']
        self.stdout.write(f'EMAIL_BACKEND : {settings.EMAIL_BACKEND}')
        self.stdout.write(f'EMAIL_HOST    : {settings.EMAIL_HOST}')
        self.stdout.write(f'EMAIL_PORT    : {settings.EMAIL_PORT}')
        self.stdout.write(f'EMAIL_USE_TLS : {settings.EMAIL_USE_TLS}')
        self.stdout.write(f'EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}')
        self.stdout.write(f'DEFAULT_FROM  : {settings.DEFAULT_FROM_EMAIL}')
        self.stdout.write(f'Sending test email to {recipient} ...')
        try:
            send_mail(
                subject='Test Email — Naresh Jewellers',
                message='This is a test email from the Naresh Jewellers backend. If you received this, email is working correctly.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
            )
            self.stdout.write(self.style.SUCCESS('Email sent successfully!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'FAILED: {e}'))
