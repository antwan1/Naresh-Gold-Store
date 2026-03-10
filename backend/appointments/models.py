from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
import datetime


class Appointment(models.Model):
    PURPOSE_CHOICES = [
        ('consultation', 'Consultation'),
        ('repair', 'Repair'),
        ('valuation', 'Valuation'),
        ('general', 'General Enquiry'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    date = models.DateField()
    time_slot = models.CharField(max_length=10)  # e.g. "10:00"
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'time_slot']

    def clean(self):
        if self.date and self.date < datetime.date.today():
            raise ValidationError({'date': 'Appointment date cannot be in the past.'})

    def __str__(self):
        return f'{self.name} — {self.date} {self.time_slot}'
