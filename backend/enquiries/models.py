from django.db import models


class Enquiry(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('responded', 'Responded'),
        ('resolved', 'Resolved'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField()
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='enquiries',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'enquiries'

    def __str__(self):
        return f'Enquiry from {self.name} ({self.email})'
