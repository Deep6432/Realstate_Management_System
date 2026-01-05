from django.contrib import admin
from django.utils.html import format_html
from .models import Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ('image', 'image_preview')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 200px; max-height: 200px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = "Preview"


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('property_type', 'city', 'khasra_number', 'size', 'size_unit', 'status', 'created_at')
    list_filter = ('property_type', 'status', 'city', 'created_at')
    search_fields = ('city', 'khasra_number', 'full_address', 'property_type')
    inlines = [PropertyImageInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('property_type', 'status')
        }),
        ('Location', {
            'fields': ('city', 'khasra_number', 'full_address')
        }),
        ('Property Details', {
            'fields': ('size', 'size_unit', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

