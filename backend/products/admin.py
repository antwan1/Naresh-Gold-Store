from django.contrib import admin
from django.utils.html import format_html, mark_safe
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    max_num = 10
    fields = ['image', 'preview', 'alt_text', 'is_primary', 'sort_order']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:4px;" />', obj.image.url)
        return '—'
    preview.short_description = 'Preview'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'product_count']
    list_filter = ['is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']

    def product_count(self, obj):
        return obj.products.filter(is_active=True).count()
    product_count.short_description = 'Products'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'metal_type', 'purity', 'price_display',
        'stock_quantity', 'stock_status', 'is_featured', 'is_active', 'thumbnail',
    ]
    list_filter = ['category', 'metal_type', 'is_featured', 'is_active', 'is_price_on_request']
    list_editable = ['is_featured', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'sku', 'description']
    inlines = [ProductImageInline]
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = [
        ('Basic Info', {
            'fields': ['name', 'slug', 'description', 'category', 'sku'],
        }),
        ('Metal Details', {
            'fields': ['metal_type', 'weight_grams', 'purity'],
        }),
        ('Pricing & Stock', {
            'fields': ['making_charge', 'price', 'is_price_on_request', 'stock_quantity'],
            'description': 'Live price = (weight × spot price + making charge) × 1.20 VAT. Set "price" only to override live pricing entirely.',
        }),
        ('Translations', {
            'fields': ['name_hi', 'description_hi', 'name_pa', 'description_pa'],
            'classes': ['collapse'],
            'description': 'Optional Hindi and Punjabi translations (leave blank to use English)',
        }),
        ('Status', {
            'fields': ['is_featured', 'is_active', 'created_at', 'updated_at'],
        }),
    ]

    def price_display(self, obj):
        if obj.is_price_on_request:
            return format_html('<em>{}</em>', 'Price on Request')
        return f'£{obj.price}' if obj.price else '—'
    price_display.short_description = 'Price'

    def stock_status(self, obj):
        if obj.stock_quantity == 0:
            return mark_safe('<span style="color:#DC2626;font-weight:600;">Out of Stock</span>')
        elif obj.stock_quantity <= 2:
            return format_html('<span style="color:#D97706;font-weight:600;">Low: {}</span>', obj.stock_quantity)
        else:
            return format_html('<span style="color:#16A34A;font-weight:600;">{} in stock</span>', obj.stock_quantity)
    stock_status.short_description = 'Stock Status'

    def thumbnail(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if image:
            return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', image.image.url)
        return '—'
    thumbnail.short_description = 'Image'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'is_primary', 'sort_order', 'alt_text']
    list_filter = ['is_primary']
    search_fields = ['product__name', 'alt_text']
