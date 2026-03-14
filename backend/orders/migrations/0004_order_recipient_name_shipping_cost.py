from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_order_contact_phone_shipping_country_alter_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='recipient_name',
            field=models.CharField(blank=True, default='', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='shipping_cost',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=6),
        ),
    ]
