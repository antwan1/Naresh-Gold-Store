from django.db import models


class GoldBuyback(models.Model):
    ITEM_CHOICES = [
        ('jewellery', 'Jewellery'),
        ('coins', 'Gold Coins / Bars'),
        ('scrap', 'Scrap Gold'),
        ('watches', 'Watches'),
        ('other', 'Other'),
    ]

    PURITY_CHOICES = [
        ('24ct', '24ct (999)'),
        ('22ct', '22ct (916)'),
        ('18ct', '18ct (750)'),
        ('14ct', '14ct (585)'),
        ('9ct', '9ct (375)'),
        ('unknown', 'Not Sure'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('completed', 'Completed'),
        ('declined', 'Declined'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    item_type = models.CharField(max_length=20, choices=ITEM_CHOICES)
    purity = models.CharField(max_length=10, choices=PURITY_CHOICES)
    estimated_weight = models.CharField(max_length=50, blank=True, help_text='e.g. "10g" or "approx 2 tola"')
    description = models.TextField(blank=True, help_text='Description of the items')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Gold Buyback Request'
        verbose_name_plural = 'Gold Buyback Requests'

    def __str__(self):
        return f'{self.name} — {self.get_item_type_display()} ({self.get_purity_display()})'
