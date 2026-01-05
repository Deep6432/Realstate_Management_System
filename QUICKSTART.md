# Quick Start Guide

## Local Development Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your local database credentials.

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE realestate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create admin user:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Collect static files:**
   ```bash
   python manage.py collectstatic --noinput
   ```

7. **Run development server:**
   
   If port 8000 is available:
   ```bash
   python manage.py runserver
   ```
   
   If port 8000 is already in use, use a different port:
   ```bash
   python manage.py runserver 8001
   ```
   
   Or use the provided script:
   ```bash
   ./runserver.sh 8001
   ```

8. **Access the application:**
   - Homepage: http://localhost:8000 (or your chosen port)
   - Admin Panel: http://localhost:8000/admin/ (or your chosen port)
   - Dashboard: http://localhost:8000/admin/dashboard/ (or your chosen port)

## Adding Your First Property

1. Login to admin panel at `/admin/`
2. Click on "Properties" → "Add Property"
3. Fill in all required fields:
   - Property Type (select from dropdown)
   - City / District / Village
   - Khasra Number
   - Full Address
   - Property Size and Unit
   - Status
4. Upload images in the "Property images" section
5. Click "Save"

## Testing Search Features

1. **City Search:** Go to homepage, enter a city name in the search box
2. **Global Search:** Use the "search everything" box on homepage
3. **Advanced Filters:** Go to `/properties/` and use the filter form

## Production Deployment Checklist

- [ ] Update `.env` with production settings
- [ ] Set `DEBUG=False` in `.env`
- [ ] Add your domain to `ALLOWED_HOSTS`
- [ ] Configure MySQL database on Hostinger
- [ ] Run migrations on production server
- [ ] Collect static files
- [ ] Configure Gunicorn to start automatically
- [ ] Set up web server (Apache/Nginx) to serve static files
- [ ] Test all functionality on production

## Common Issues

### Database Connection Error
- Check MySQL credentials in `.env`
- Ensure MySQL service is running
- Verify database exists

### Static Files Not Loading
- Run `python manage.py collectstatic`
- Check `STATIC_ROOT` path in settings.py
- Verify web server configuration

### Images Not Uploading
- Check `MEDIA_ROOT` permissions
- Ensure `media/` directory exists
- Verify file upload size limits

### Port Already in Use
- Use a different port: `python manage.py runserver 8001`
- Or stop the other process using port 8000
- Check what's using the port: `lsof -ti:8000`

