from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from django.db.models import Sum
from django.utils.decorators import method_decorator
from django.contrib.admin.views.decorators import staff_member_required


class CoreAdminSite:
    """Mixin to add custom admin views to the default admin site."""
    pass


def stats_view(request):
    from orders.models import Order
    from products.models import Product
    from customers.models import Customer
    from reviews.models import Review
    from enquiries.models import Enquiry
    from appointments.models import Appointment

    total_revenue = Order.objects.exclude(status='cancelled').aggregate(
        total=Sum('total_amount')
    )['total'] or 0

    context = {
        **admin.site.each_context(request),
        'title': 'Store Dashboard',
        'stats': {
            'total_orders': Order.objects.count(),
            'total_revenue': f'{total_revenue:,.2f}',
            'total_customers': Customer.objects.count(),
            'pending_reviews': Review.objects.filter(is_approved=False).count(),
            'new_enquiries': Enquiry.objects.filter(status='new').count(),
            'pending_appointments': Appointment.objects.filter(status='pending').count(),
        },
        'recent_orders': Order.objects.select_related('user').order_by('-created_at')[:8],
        'low_stock': Product.objects.filter(is_active=True, stock_quantity__lte=5).order_by('stock_quantity')[:10],
    }
    return TemplateResponse(request, 'admin/stats.html', context)


# Monkey-patch the admin site to add our custom URL
_original_get_urls = admin.site.__class__.get_urls


def _patched_get_urls(self):
    urls = _original_get_urls(self)
    custom = [
        path('stats/', self.admin_view(stats_view), name='core_stats'),
    ]
    return custom + urls


admin.site.__class__.get_urls = _patched_get_urls
