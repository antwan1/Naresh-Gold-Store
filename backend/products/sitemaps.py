from django.contrib.sitemaps import Sitemap
from .models import Product, Category


class _FrontendSite:
    """Lightweight stand-in for django.contrib.sites so sitemap URLs point
    at the public frontend domain instead of the backend's Render host."""
    domain = 'naresh-jewellers.com'
    name = 'Naresh Jewellers'


class FrontendSitemap(Sitemap):
    protocol = 'https'

    def get_urls(self, page=1, site=None, protocol=None):
        return super().get_urls(page=page, site=_FrontendSite(), protocol='https')


class StaticViewSitemap(FrontendSitemap):
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


class ProductSitemap(FrontendSitemap):
    changefreq = 'weekly'
    priority = 0.8

    def items(self):
        return Product.objects.filter(is_active=True)

    def location(self, obj):
        return f'/shop/{obj.slug}'


class CategorySitemap(FrontendSitemap):
    changefreq = 'weekly'
    priority = 0.6

    def items(self):
        return Category.objects.filter(is_active=True)

    def location(self, obj):
        return f'/shop?category={obj.slug}'
