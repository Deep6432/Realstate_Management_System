from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.db.models import Q
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Property, PropertyImage, PROPERTY_TYPE_CHOICES, STATUS_CHOICES
from .forms import PropertyForm


def homepage(request):
    """Homepage with city search"""
    context = {
        'property_types': PROPERTY_TYPE_CHOICES,
    }
    return render(request, 'properties/homepage.html', context)


def property_list(request):
    """Property listing page with search and filters"""
    properties = Property.objects.all()
    
    # City search
    city_query = request.GET.get('city', '').strip()
    if city_query:
        properties = properties.filter(city__icontains=city_query)
    
    # Global search
    search_query = request.GET.get('search', '').strip()
    if search_query:
        properties = properties.filter(
            Q(city__icontains=search_query) |
            Q(khasra_number__icontains=search_query) |
            Q(full_address__icontains=search_query) |
            Q(property_type__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    # Filters
    property_type = request.GET.get('property_type', '')
    if property_type:
        properties = properties.filter(property_type=property_type)
    
    status = request.GET.get('status', '')
    if status:
        properties = properties.filter(status=status)
    
    size_min = request.GET.get('size_min', '')
    size_max = request.GET.get('size_max', '')
    if size_min:
        try:
            properties = properties.filter(size__gte=float(size_min))
        except ValueError:
            pass
    if size_max:
        try:
            properties = properties.filter(size__lte=float(size_max))
        except ValueError:
            pass
    
    # Pagination
    paginator = Paginator(properties, 12)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    context = {
        'properties': page_obj,
        'property_types': PROPERTY_TYPE_CHOICES,
        'status_choices': STATUS_CHOICES,
        'current_city': city_query,
        'current_search': search_query,
        'current_type': property_type,
        'current_status': status,
        'size_min': size_min,
        'size_max': size_max,
    }
    
    return render(request, 'properties/property_list.html', context)


def property_detail(request, pk):
    """Property detail page"""
    property_obj = get_object_or_404(Property, pk=pk)
    images = property_obj.get_images()
    
    context = {
        'property': property_obj,
        'images': images,
    }
    
    return render(request, 'properties/property_detail.html', context)


def api_search(request):
    """API endpoint for AJAX search"""
    query = request.GET.get('q', '').strip()
    
    if not query:
        return JsonResponse({'properties': []})
    
    properties = Property.objects.filter(
        Q(city__icontains=query) |
        Q(khasra_number__icontains=query) |
        Q(full_address__icontains=query) |
        Q(property_type__icontains=query) |
        Q(description__icontains=query)
    )[:10]  # Limit to 10 results
    
    results = []
    for prop in properties:
        primary_image = prop.get_primary_image()
        results.append({
            'id': prop.id,
            'property_type': prop.property_type,
            'city': prop.city,
            'khasra_number': prop.khasra_number,
            'size': str(prop.size),
            'size_unit': prop.size_unit,
            'status': prop.status,
            'image_url': primary_image.url if primary_image else None,
            'url': f'/property/{prop.id}/',
        })
    
    return JsonResponse({'properties': results})


def custom_login(request):
    """Custom login view with UI"""
    if request.user.is_authenticated:
        return redirect('admin_dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, 'Login successful!')
            next_url = request.GET.get('next', 'admin_dashboard')
            return redirect(next_url)
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'properties/login.html')


def custom_logout(request):
    """Custom logout view"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('homepage')


@login_required
def admin_dashboard(request):
    """Admin dashboard with property counts"""
    total_properties = Property.objects.count()
    available_properties = Property.objects.filter(status='Available').count()
    sold_properties = Property.objects.filter(status='Sold').count()
    on_hold_properties = Property.objects.filter(status='On Hold').count()
    
    properties_by_type = {}
    for prop_type, _ in PROPERTY_TYPE_CHOICES:
        properties_by_type[prop_type] = Property.objects.filter(property_type=prop_type).count()
    
    # Handle search
    search_query = request.GET.get('search', '').strip()
    properties = Property.objects.all()
    
    if search_query:
        properties = properties.filter(
            Q(city__icontains=search_query) |
            Q(khasra_number__icontains=search_query) |
            Q(full_address__icontains=search_query) |
            Q(property_type__icontains=search_query) |
            Q(description__icontains=search_query)
        )
        is_search = True
        section_title = f'Search Results ({properties.count()})'
    else:
        properties = properties[:10]
        is_search = False
        section_title = 'Recent Properties'
    
    context = {
        'total_properties': total_properties,
        'available_properties': available_properties,
        'sold_properties': sold_properties,
        'on_hold_properties': on_hold_properties,
        'properties_by_type': properties_by_type,
        'properties': properties,
        'is_search': is_search,
        'section_title': section_title,
        'search_query': search_query,
    }
    
    return render(request, 'properties/admin_dashboard.html', context)


@login_required
def add_property(request):
    """Add new property view"""
    if request.method == 'POST':
        form = PropertyForm(request.POST, request.FILES)
        if form.is_valid():
            property_obj = form.save()
            
            # Handle multiple image uploads
            images = request.FILES.getlist('images')
            for image in images:
                PropertyImage.objects.create(property=property_obj, image=image)
            
            if images:
                messages.success(request, f'Property "{property_obj}" has been added with {len(images)} image(s)!')
            else:
                messages.success(request, f'Property "{property_obj}" has been added successfully!')
            return redirect('admin_dashboard')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = PropertyForm()
    
    context = {
        'form': form,
        'title': 'Add New Property',
        'action': 'Add'
    }
    return render(request, 'properties/property_form.html', context)


@login_required
def edit_property(request, pk):
    """Edit existing property view"""
    property_obj = get_object_or_404(Property, pk=pk)
    existing_images = property_obj.get_images()
    
    if request.method == 'POST':
        form = PropertyForm(request.POST, request.FILES, instance=property_obj)
        if form.is_valid():
            property_obj = form.save()
            
            # Handle multiple image uploads
            images = request.FILES.getlist('images')
            for image in images:
                PropertyImage.objects.create(property=property_obj, image=image)
            
            # Handle image deletion
            delete_images = request.POST.getlist('delete_images')
            for image_id in delete_images:
                try:
                    PropertyImage.objects.filter(id=image_id, property=property_obj).delete()
                except:
                    pass
            
            if images:
                messages.success(request, f'Property "{property_obj}" has been updated with {len(images)} new image(s)!')
            else:
                messages.success(request, f'Property "{property_obj}" has been updated successfully!')
            return redirect('admin_dashboard')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = PropertyForm(instance=property_obj)
    
    context = {
        'form': form,
        'property': property_obj,
        'existing_images': existing_images,
        'title': 'Edit Property',
        'action': 'Update'
    }
    return render(request, 'properties/property_form.html', context)


@login_required
def delete_property(request, pk):
    """Delete property view"""
    property_obj = get_object_or_404(Property, pk=pk)
    
    if request.method == 'POST':
        property_name = str(property_obj)
        property_obj.delete()
        messages.success(request, f'Property "{property_name}" has been deleted successfully!')
        return redirect('admin_dashboard')
    
    context = {
        'property': property_obj,
    }
    return render(request, 'properties/delete_property.html', context)

