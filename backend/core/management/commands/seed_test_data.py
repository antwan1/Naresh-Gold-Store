from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import Category, Product, ProductImage


CATEGORIES = [
    {'name': 'Gold', 'description': 'Exquisite gold jewellery crafted with precision'},
    {'name': 'Silver', 'description': 'Elegant sterling silver pieces for every occasion'},
    {'name': 'Diamond', 'description': 'Stunning diamond jewellery for life\'s special moments'},
    {'name': 'South-East Asian', 'description': 'Traditional South-East Asian jewellery with a modern touch'},
]

PRODUCTS = [
    # Gold
    {
        'name': '22K Gold Bangle Set', 'category': 'Gold', 'metal_type': 'gold',
        'weight_grams': '45.50', 'purity': '22K', 'price': '2850.00',
        'sku': 'GLD-001', 'stock_quantity': 5, 'is_featured': True,
        'description': 'Beautifully crafted 22K gold bangle set, perfect for weddings and celebrations. Each bangle features delicate filigree work inspired by traditional South-Asian designs.',
    },
    {
        'name': '18K Gold Chain Necklace', 'category': 'Gold', 'metal_type': 'gold',
        'weight_grams': '12.30', 'purity': '18K', 'price': '780.00',
        'sku': 'GLD-002', 'stock_quantity': 8, 'is_featured': True,
        'description': 'Elegant 18K gold chain necklace, 45cm length. A timeless piece that complements any outfit from casual to formal.',
    },
    {
        'name': '22K Gold Earrings — Jhumka Style', 'category': 'Gold', 'metal_type': 'gold',
        'weight_grams': '8.75', 'purity': '22K', 'price': '545.00',
        'sku': 'GLD-003', 'stock_quantity': 12, 'is_featured': False,
        'description': 'Traditional jhumka-style gold earrings in 22K gold. Features a bell-shaped drop with intricate granulation work.',
    },
    {
        'name': '24K Gold Coin Pendant', 'category': 'Gold', 'metal_type': 'gold',
        'weight_grams': '5.00', 'purity': '24K', 'price': '420.00',
        'sku': 'GLD-004', 'stock_quantity': 6, 'is_featured': False,
        'description': 'Pure 24K gold coin pendant engraved with Lakshmi motif. Comes with an 18K gold chain (45cm).',
    },
    {
        'name': '22K Gold Wedding Ring Set', 'category': 'Gold', 'metal_type': 'gold',
        'weight_grams': '18.20', 'purity': '22K', 'price': '1150.00',
        'sku': 'GLD-005', 'stock_quantity': 3, 'is_featured': True,
        'description': 'Matching 22K gold wedding ring set for bride and groom. Both rings feature a simple yet elegant band with a brushed gold finish.',
    },
    # Silver
    {
        'name': '925 Sterling Silver Bracelet', 'category': 'Silver', 'metal_type': 'silver',
        'weight_grams': '22.00', 'purity': '925 Sterling', 'price': '85.00',
        'sku': 'SLV-001', 'stock_quantity': 15, 'is_featured': True,
        'description': 'Oxidised 925 sterling silver bracelet with intricate floral pattern. Adjustable size fits most wrist sizes.',
    },
    {
        'name': 'Silver Toe Rings Set of 5', 'category': 'Silver', 'metal_type': 'silver',
        'weight_grams': '9.50', 'purity': '925 Sterling', 'price': '35.00',
        'sku': 'SLV-002', 'stock_quantity': 20, 'is_featured': False,
        'description': 'Traditional set of 5 sterling silver toe rings. Adjustable design fits various toe sizes. A staple in South Asian bridal jewellery.',
    },
    {
        'name': 'Silver Anklet with Bells', 'category': 'Silver', 'metal_type': 'silver',
        'weight_grams': '28.00', 'purity': '925 Sterling', 'price': '65.00',
        'sku': 'SLV-003', 'stock_quantity': 10, 'is_featured': False,
        'description': 'Traditional payal (anklet) in 925 sterling silver with small golden bells. Sold as a pair.',
    },
    {
        'name': 'Silver Filigree Earrings', 'category': 'Silver', 'metal_type': 'silver',
        'weight_grams': '6.20', 'purity': '925 Sterling', 'price': '45.00',
        'sku': 'SLV-004', 'stock_quantity': 18, 'is_featured': False,
        'description': 'Delicate filigree drop earrings in 925 sterling silver. Lightweight and comfortable for everyday wear.',
    },
    # Diamond
    {
        'name': 'Diamond Solitaire Ring', 'category': 'Diamond', 'metal_type': 'diamond',
        'weight_grams': '4.50', 'purity': '18K White Gold', 'price': None,
        'is_price_on_request': True,
        'sku': 'DMD-001', 'stock_quantity': 2, 'is_featured': True,
        'description': 'Stunning 1ct diamond solitaire ring set in 18K white gold. GIA certified. The centrepiece stone is round brilliant cut with VS1 clarity and G colour.',
        'slug': 'diamond-solitaire-ring',
    },
    {
        'name': 'Diamond Tennis Bracelet', 'category': 'Diamond', 'metal_type': 'diamond',
        'weight_grams': '10.80', 'purity': '18K White Gold', 'price': None,
        'is_price_on_request': True,
        'sku': 'DMD-002', 'stock_quantity': 1, 'is_featured': True,
        'description': 'Classic diamond tennis bracelet featuring 3ct total weight of round brilliant cut diamonds set in 18K white gold. Box clasp with safety catch.',
    },
    {
        'name': 'Diamond Halo Stud Earrings', 'category': 'Diamond', 'metal_type': 'diamond',
        'weight_grams': '3.20', 'purity': '18K Yellow Gold', 'price': '2200.00',
        'sku': 'DMD-003', 'stock_quantity': 4, 'is_featured': False,
        'description': 'Beautiful halo stud earrings featuring a central round diamond surrounded by a halo of smaller diamonds. Total diamond weight 0.5ct.',
    },
    # South-East Asian
    {
        'name': 'Kundan Choker Necklace', 'category': 'South-East Asian', 'metal_type': 'gold',
        'weight_grams': '65.00', 'purity': '22K with Kundan', 'price': '4200.00',
        'sku': 'SEA-001', 'stock_quantity': 2, 'is_featured': True,
        'description': 'Spectacular Kundan choker necklace set in 22K gold. Features uncut Polki diamonds, Kundan work, and hand-set glass stones. Includes matching earrings.',
    },
    {
        'name': 'Temple Jewellery Necklace', 'category': 'South-East Asian', 'metal_type': 'gold',
        'weight_grams': '55.30', 'purity': '22K', 'price': '3450.00',
        'sku': 'SEA-002', 'stock_quantity': 3, 'is_featured': False,
        'description': 'Traditional South Indian temple jewellery necklace in 22K gold. Features deity motifs, ruby and emerald stones. Handcrafted by master artisans.',
    },
    {
        'name': 'Meenakari Gold Bangle', 'category': 'South-East Asian', 'metal_type': 'gold',
        'weight_grams': '25.00', 'purity': '22K', 'price': '1580.00',
        'sku': 'SEA-003', 'stock_quantity': 6, 'is_featured': False,
        'description': 'Vibrant Meenakari gold bangle featuring hand-painted enamel work in traditional Rajasthani style. 22K gold base with pink and green enamel.',
    },
    {
        'name': 'Polki Diamond Maang Tikka', 'category': 'South-East Asian', 'metal_type': 'diamond',
        'weight_grams': '18.50', 'purity': '22K Gold with Polki', 'price': None,
        'is_price_on_request': True,
        'sku': 'SEA-004', 'stock_quantity': 3, 'is_featured': False,
        'description': 'Traditional Polki diamond maang tikka (head ornament) in 22K gold. Features uncut diamonds set in the traditional manner with silver foil backing.',
    },
]


class Command(BaseCommand):
    help = 'Seed the database with test data for development and testing'

    def handle(self, *args, **options):
        self.stdout.write('Seeding test data...')

        # Create admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@nareshjewellers.co.uk',
                password='AdminPassword123!',
            )
            self.stdout.write(self.style.SUCCESS('  Created admin user'))
        else:
            self.stdout.write('  Admin user already exists')

        # Create test customer
        if not User.objects.filter(username='testcustomer').exists():
            User.objects.create_user(
                username='testcustomer',
                email='testcustomer@example.com',
                password='TestPassword123!',
                first_name='Test',
                last_name='Customer',
            )
            self.stdout.write(self.style.SUCCESS('  Created test customer'))
        else:
            self.stdout.write('  Test customer already exists')

        # Create categories
        category_map = {}
        for cat_data in CATEGORIES:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']},
            )
            category_map[cat_data['name']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Created category: {category.name}'))

        # Create products
        for prod_data in PRODUCTS:
            category = category_map[prod_data.pop('category')]
            slug = prod_data.pop('slug', None)

            product, created = Product.objects.get_or_create(
                sku=prod_data['sku'],
                defaults={**prod_data, 'category': category},
            )
            if slug and not product.slug:
                product.slug = slug
                product.save()
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Created product: {product.name}'))

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! Created {Category.objects.count()} categories and {Product.objects.count()} products.'
        ))
        self.stdout.write('Admin credentials: admin@nareshjewellers.co.uk / AdminPassword123!')
        self.stdout.write('Test customer:     testcustomer@example.com / TestPassword123!')
