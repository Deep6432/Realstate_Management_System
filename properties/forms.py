from django import forms
from .models import Property, PropertyImage, PROPERTY_TYPE_CHOICES, STATUS_CHOICES, SIZE_UNIT_CHOICES


class PropertyForm(forms.ModelForm):
    """Form for adding/editing properties"""
    
    class Meta:
        model = Property
        fields = [
            'property_type', 'city', 'khasra_number', 'full_address',
            'size', 'size_unit', 'description', 'status'
        ]
        widgets = {
            'property_type': forms.Select(attrs={
                'class': 'form-input',
                'required': True
            }),
            'city': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter city name',
                'required': True
            }),
            'khasra_number': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Enter khasra number',
                'required': True
            }),
            'full_address': forms.Textarea(attrs={
                'class': 'form-input',
                'rows': 3,
                'placeholder': 'Enter full address',
                'required': True
            }),
            'size': forms.NumberInput(attrs={
                'class': 'form-input',
                'step': '0.01',
                'placeholder': 'Enter size',
                'required': True
            }),
            'size_unit': forms.Select(attrs={
                'class': 'form-input',
                'required': True
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-input',
                'rows': 5,
                'placeholder': 'Enter property description (optional)'
            }),
            'status': forms.Select(attrs={
                'class': 'form-input',
                'required': True
            }),
        }


class PropertyImageForm(forms.ModelForm):
    """Form for uploading property images"""
    
    class Meta:
        model = PropertyImage
        fields = ['image']
        widgets = {
            'image': forms.FileInput(attrs={
                'class': 'form-input',
                'accept': 'image/*'
            })
        }

