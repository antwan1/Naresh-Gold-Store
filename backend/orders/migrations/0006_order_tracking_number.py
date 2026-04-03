from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_remove_paypal_add_commission'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='tracking_number',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
