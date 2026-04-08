from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from django.http import JsonResponse, HttpResponse
from django.contrib.sitemaps.views import sitemap
from products.sitemaps import ProductSitemap, CategorySitemap, StaticViewSitemap

sitemaps = {
    'static': StaticViewSitemap,
    'products': ProductSitemap,
    'categories': CategorySitemap,
}


def health(request):
    return JsonResponse({'status': 'ok'})


def robots_txt(request):
    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Allow: /",
        "Sitemap: https://naresh-jewellers.com/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


urlpatterns = [
    path('health/', health),
    path('robots.txt', robots_txt),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/', include('customers.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('enquiries.urls')),
    path('api/', include('appointments.urls')),
    path('api/', include('reviews.urls')),
    path('api/', include('wishlist.urls')),
    path('api/', include('buyback.urls')),
    path('api/', include('custom_orders.urls')),
    path('api/', include('core.urls')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
