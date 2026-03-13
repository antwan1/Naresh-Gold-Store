from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_add_bank_transfer_payment'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='contact_phone',
            field=models.CharField(blank=True, default='', max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='shipping_country',
            field=models.CharField(blank=True, default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='order',
            name='shipping_address_line1',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='order',
            name='shipping_city',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='order',
            name='shipping_postcode',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AlterField(
            model_name='order',
            name='payment_method',
            field=models.CharField(
                choices=[('stripe', 'Stripe'), ('paypal', 'PayPal'), ('cash', 'Cash on Collection')],
                max_length=20,
            ),
        ),
    ]
