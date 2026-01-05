# Real Estate Inventory Management System

A comprehensive web-based Real Estate Inventory Management System built with Django, MySQL, and modern frontend technologies. This system allows admins to manage different types of real estate properties and enables users to search properties easily by city and other fields.

## Features

### Property Management
- **8 Property Types**: Home, Flat/Apartment, Land, Commercial Land, Plot, Farm Land, Warehouse, Shop
- **Complete Property Information**: City, Khasra Number, Full Address, Size, Description, Status
- **Multiple Image Upload**: Support for multiple images per property
- **Status Management**: Available, Sold, On Hold

### Search & Filter
- **City-based Search**: Primary search functionality on homepage
- **Global Search**: Search across all fields (city, khasra number, address, type, description)
- **Advanced Filters**: Filter by property type, city, size range, and status
- **Real-time Results**: AJAX-based search for instant results

### User Interface
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Admin Panel**: Secure login system with dashboard
- **Property Listings**: Beautiful card-based property display
- **Property Details**: Comprehensive property detail pages
- **Image Gallery**: Image preview and thumbnail navigation

## Tech Stack

- **Backend**: Django 4.2.7 (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: MySQL
- **Web Server**: Gunicorn
- **Image Processing**: Pillow

## Installation & Setup

### Prerequisites
- Python 3.8+
- MySQL 5.7+ or MySQL 8.0+
- pip (Python package manager)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd "Real Estate invt Management"
```

### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your settings:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=realestate_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
```

### Step 5: Create MySQL Database
```sql
CREATE DATABASE realestate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 6: Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 7: Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 8: Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### Step 9: Run Development Server
```bash
python manage.py runserver
```

Visit `http://localhost:8000` to see the application.

## Deployment on Hostinger

### Step 1: Upload Files
Upload all project files to your Hostinger hosting account (typically to `public_html` or a subdirectory).

### Step 2: Configure Environment Variables
Create a `.env` file on the server with production settings:
```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=your_hostinger_db_name
DB_USER=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password
DB_HOST=localhost
DB_PORT=3306
```

### Step 3: Set Up MySQL Database
1. Log in to Hostinger hPanel
2. Go to MySQL Databases
3. Create a new database and user
4. Note down the database credentials

### Step 4: Install Dependencies
SSH into your Hostinger account and run:
```bash
cd public_html  # or your project directory
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 5: Run Migrations
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### Step 6: Configure Gunicorn
Create a systemd service file or use Hostinger's process manager to run:
```bash
gunicorn --config gunicorn_config.py realestate_project.wsgi:application
```

### Step 7: Configure Web Server
Set up your web server (Apache/Nginx) to:
- Serve static files from `/staticfiles`
- Serve media files from `/media`
- Proxy requests to Gunicorn on port 8000

### Step 8: Set File Permissions
```bash
chmod -R 755 staticfiles
chmod -R 755 media
```

## Project Structure

```
Real Estate invt Management/
├── manage.py
├── requirements.txt
├── gunicorn_config.py
├── .env.example
├── .gitignore
├── README.md
├── realestate_project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── properties/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── admin.py
│   └── apps.py
├── templates/
│   ├── base.html
│   └── properties/
│       ├── homepage.html
│       ├── property_list.html
│       ├── property_detail.html
│       └── admin_dashboard.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── media/
│   └── property_images/
└── staticfiles/
```

## Usage

### Admin Panel
1. Navigate to `/admin/`
2. Login with your superuser credentials
3. Manage properties:
   - Add new properties
   - Edit existing properties
   - Upload multiple images
   - Delete properties
4. View dashboard at `/admin/dashboard/`

### User Features
1. **Homepage**: Search properties by city
2. **Global Search**: Search across all fields
3. **Property Listings**: Browse all properties with filters
4. **Property Details**: View complete property information

## API Endpoints

- `GET /api/search/?q=query` - Global search API (returns JSON)

## Security Notes

- Change `SECRET_KEY` in production
- Set `DEBUG=False` in production
- Use strong database passwords
- Keep dependencies updated
- Use HTTPS in production

## Support

For issues or questions, please contact the development team.

## License

This project is proprietary software. All rights reserved.


