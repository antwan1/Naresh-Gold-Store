from django.contrib.sitemaps import Sitemap
from .models import Product, Category


class StaticViewSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.7

    def items(self):
        return [
            '/',
            '/shop',
            '/about',
            '/contact',
            '/appointments',
            '/sell-gold',
            '/custom-jewellery',
            '/privacy-policy',
            '/terms',
        ]

    def location(self, obj):
        return obj


class ProductSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.8

    def items(self):
        return Product.objects.filter(is_active=True)

    def location(self, obj):
        return f'/shop/{obj.slug}'


class CategorySitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.6

    def items(self):
        return Category.objects.filter(is_active=True)

    def location(self, obj):
        return f'/shop?category={obj.slug}'
