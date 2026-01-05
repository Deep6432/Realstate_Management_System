"""
URL configuration for realestate_project project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from properties import views as properties_views

urlpatterns = [
    path('admin/dashboard/', properties_views.admin_dashboard, name='admin_dashboard'),
    path('admin/property/add/', properties_views.add_property, name='add_property'),
    path('admin/property/<int:pk>/edit/', properties_views.edit_property, name='edit_property'),
    path('admin/property/<int:pk>/delete/', properties_views.delete_property, name='delete_property'),
    path('admin/', admin.site.urls),
    path('', include('properties.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

