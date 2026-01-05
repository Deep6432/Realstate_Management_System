from django.db import models
from django.utils import timezone


PROPERTY_TYPE_CHOICES = [
    ('Home', 'Home'),
    ('Flat / Apartment', 'Flat / Apartment'),
    ('Land', 'Land'),
    ('Commercial Land', 'Commercial Land'),
    ('Plot', 'Plot'),
    ('Farm Land', 'Farm Land'),
    ('Warehouse', 'Warehouse'),
    ('Shop', 'Shop'),
]

SIZE_UNIT_CHOICES = [
    ('sq ft', 'sq ft'),
    ('sq yard', 'sq yard'),
    ('acre', 'acre'),
]

STATUS_CHOICES = [
    ('Available', 'Available'),
    ('Sold', 'Sold'),
    ('On Hold', 'On Hold'),
]


class Property(models.Model):
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPE_CHOICES)
    city = models.CharField(max_length=200)
    khasra_number = models.CharField(max_length=100)
    full_address = models.TextField()
    size = models.DecimalField(max_digits=15, decimal_places=2)
    size_unit = models.CharField(max_length=20, choices=SIZE_UNIT_CHOICES)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['property_type']),
            models.Index(fields=['status']),
            models.Index(fields=['khasra_number']),
        ]

    def __str__(self):
        return f"{self.property_type} - {self.city} ({self.khasra_number})"

    def get_images(self):
        return self.propertyimage_set.all()

    def get_primary_image(self):
        first_image = self.propertyimage_set.first()
        return first_image.image if first_image else None


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='property_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return f"Image for {self.property}"


