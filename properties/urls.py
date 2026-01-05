from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('properties/', views.property_list, name='property_list'),
    path('property/<int:pk>/', views.property_detail, name='property_detail'),
    path('api/search/', views.api_search, name='api_search'),
    path('login/', views.custom_login, name='custom_login'),
    path('logout/', views.custom_logout, name='custom_logout'),
]

