from django.db import models


class CustomOrderEnquiry(models.Model):
    PIECE_CHOICES = [
        ('ring', 'Ring'),
        ('necklace', 'Necklace / Chain'),
        ('bracelet', 'Bracelet / Bangle'),
        ('earrings', 'Earrings'),
        ('pendant', 'Pendant'),
        ('set', 'Jewellery Set'),
        ('other', 'Other'),
    ]

    METAL_CHOICES = [
        ('gold_22ct', '22ct Gold'),
        ('gold_18ct', '18ct Gold'),
        ('gold_24ct', '24ct Gold'),
        ('white_gold', 'White Gold'),
        ('rose_gold', 'Rose Gold'),
        ('silver', 'Silver'),
        ('platinum', 'Platinum'),
        ('unsure', 'Not sure — advise me'),
    ]

    BUDGET_CHOICES = [
        ('under_500', 'Under £500'),
        ('500_1000', '£500 – £1,000'),
        ('1000_2500', '£1,000 – £2,500'),
        ('2500_5000', '£2,500 – £5,000'),
        ('over_5000', 'Over £5,000'),
        ('flexible', 'Flexible / Not sure'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_discussion', 'In Discussion'),
        ('quoted', 'Quoted'),
        ('accepted', 'Accepted'),
        ('in_production', 'In Production'),
        ('completed', 'Completed'),
        ('declined', 'Declined'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    piece_type = models.CharField(max_length=20, choices=PIECE_CHOICES)
    metal = models.CharField(max_length=20, choices=METAL_CHOICES)
    budget = models.CharField(max_length=20, choices=BUDGET_CHOICES)
    description = models.TextField()
    occasion = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Custom Order Enquiry'
        verbose_name_plural = 'Custom Order Enquiries'

    def __str__(self):
        return f'Custom {self.get_piece_type_display()} — {self.name} ({self.email})'
