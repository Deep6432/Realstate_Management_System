# Hostinger Deployment Guide

This guide will help you deploy the Real Estate Inventory Management System to Hostinger hosting.

## Prerequisites

- Hostinger hosting account with Python support
- MySQL database created in Hostinger control panel
- Domain name configured
- SSH access (if available) or File Manager access

## Step 1: Prepare Your Local Environment

1. **Generate a new SECRET_KEY**:
   ```python
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

2. **Create a `.env` file** in your project root with the following content:
   ```env
   # Django Settings
   SECRET_KEY=your-generated-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

   # Database Configuration (MySQL for Hostinger)
   DB_ENGINE=mysql
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   DB_PORT=3306

   # SSL Settings (set to True if you have SSL certificate)
   SECURE_SSL_REDIRECT=False
   ```

## Step 2: Upload Files to Hostinger

### Option A: Using File Manager
1. Log in to your Hostinger control panel
2. Navigate to File Manager
3. Go to `public_html` (or your domain's root directory)
4. Upload all project files (except `db.sqlite3`, `__pycache__`, `.env`)

### Option B: Using FTP/SFTP
1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your Hostinger server
3. Upload all project files to `public_html`

### Option C: Using Git (if available)
1. Initialize a git repository
2. Push your code to a private repository
3. Clone it on the server

**Important Files to Upload:**
- All Python files (`*.py`)
- `manage.py`
- `requirements.txt`
- `gunicorn_config.py`
- `deploy.sh`
- `start.sh`
- `templates/` directory
- `static/` directory
- `.htaccess` file
- `realestate_project/` directory
- `properties/` directory

**Files to Exclude:**
- `db.sqlite3` (use MySQL instead)
- `__pycache__/` directories
- `.env` (create it on the server)
- `venv/` (create it on the server)
- `.git/` directory

## Step 3: Set Up Python Environment on Hostinger

### Via SSH (if available):
```bash
# Navigate to your project directory
cd ~/public_html

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### Via Hostinger Control Panel:
1. Go to **Advanced** → **Python App**
2. Create a new Python app
3. Set Python version to 3.8 or higher
4. Point it to your project directory
5. Install dependencies through the interface

## Step 4: Configure Database

1. **Create MySQL Database in Hostinger:**
   - Go to **Databases** → **MySQL Databases**
   - Create a new database
   - Create a new database user
   - Grant all privileges to the user
   - Note down: Database name, Username, Password, Host (usually `localhost`)

2. **Create `.env` file on server:**
   - In your project root, create a `.env` file
   - Add the database credentials and other settings (see Step 1)

3. **Run Migrations:**
   ```bash
   # Activate virtual environment
   source venv/bin/activate

   # Run migrations
   python manage.py migrate

   # Create superuser
   python manage.py createsuperuser
   ```

## Step 5: Collect Static Files

```bash
# Activate virtual environment
source venv/bin/activate

# Collect static files
python manage.py collectstatic --noinput
```

This will create a `staticfiles/` directory with all your static files.

## Step 6: Set File Permissions

```bash
# Set proper permissions
chmod -R 755 staticfiles
chmod -R 755 media
chmod 644 .htaccess
chmod 644 .env
```

## Step 7: Configure Gunicorn

### Option A: Using Hostinger Python App (Recommended)
1. In Hostinger control panel, go to **Advanced** → **Python App**
2. Set **App File** to: `realestate_project/wsgi.py`
3. Set **App Startup File** to: `gunicorn_config.py` (or use the start command)
4. Set **Startup Command** to:
   ```
   gunicorn --config gunicorn_config.py realestate_project.wsgi:application
   ```

### Option B: Using Systemd Service (if you have root access)
Create a service file `/etc/systemd/system/realestate.service`:
```ini
[Unit]
Description=Real Estate Gunicorn daemon
After=network.target

[Service]
User=your_username
Group=your_group
WorkingDirectory=/home/your_username/public_html
Environment="PATH=/home/your_username/public_html/venv/bin"
ExecStart=/home/your_username/public_html/venv/bin/gunicorn --config gunicorn_config.py realestate_project.wsgi:application

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl start realestate
sudo systemctl enable realestate
```

### Option C: Using Passenger (if available)
Create a `passenger_wsgi.py` file in your project root:
```python
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from realestate_project.wsgi import application
```

## Step 8: Configure Apache/Web Server

Hostinger typically uses Apache. The `.htaccess` file should handle most routing, but you may need to:

1. **Enable mod_rewrite** (usually enabled by default)
2. **Configure Passenger** (if using Passenger for Python apps)
3. **Set up reverse proxy** to Gunicorn (if running separately)

### For Passenger Setup:
In your `.htaccess`, ensure you have:
```apache
PassengerEnabled On
PassengerAppRoot /home/your_username/public_html
PassengerPython /home/your_username/public_html/venv/bin/python
```

## Step 9: Test Your Deployment

1. **Visit your domain** in a browser
2. **Check static files** are loading (CSS, JS, images)
3. **Test admin login** at `/login/`
4. **Test property listing** and search functionality
5. **Test image uploads** in admin dashboard

## Step 10: Set Up Automatic Startup (Optional)

If you have SSH access, you can use:
- **Cron job** to check if Gunicorn is running
- **Supervisor** to manage the process
- **Systemd service** (if root access)

## Troubleshooting

### Static Files Not Loading
- Run `python manage.py collectstatic --noinput` again
- Check `STATIC_ROOT` path in `settings.py`
- Verify `.htaccess` is correctly routing static files
- Check file permissions: `chmod -R 755 staticfiles`

### Media Files Not Uploading
- Check `MEDIA_ROOT` permissions: `chmod -R 755 media`
- Verify `media/` directory exists
- Check file upload size limits in `settings.py`

### Database Connection Error
- Verify database credentials in `.env`
- Check if MySQL service is running
- Ensure database exists and user has proper permissions
- Test connection: `mysql -u username -p database_name`

### 500 Internal Server Error
- Check error logs in Hostinger control panel
- Enable `DEBUG=True` temporarily to see error details
- Check Gunicorn logs
- Verify all environment variables are set correctly

### Gunicorn Not Starting
- Check if port 8000 is available
- Verify virtual environment is activated
- Check Gunicorn configuration file
- Review error logs

### Permission Denied Errors
```bash
# Fix permissions
chmod -R 755 .
chmod 644 .env
chmod 644 .htaccess
```

## Security Checklist

- [ ] `DEBUG=False` in production
- [ ] Strong `SECRET_KEY` set
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] Database credentials are secure
- [ ] `.env` file is not publicly accessible
- [ ] SSL certificate installed (if available)
- [ ] `SECURE_SSL_REDIRECT=True` (if using SSL)
- [ ] Strong admin password set
- [ ] File permissions are correct

## Maintenance

### Regular Updates
```bash
# Activate virtual environment
source venv/bin/activate

# Update dependencies
pip install --upgrade -r requirements.txt

# Run migrations if needed
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Restart Gunicorn
# (Method depends on how you set it up)
```

### Backup Database
```bash
# Backup MySQL database
mysqldump -u username -p database_name > backup.sql

# Or use Hostinger's backup feature in control panel
```

## Support

For Hostinger-specific issues:
- Check Hostinger documentation
- Contact Hostinger support
- Check Hostinger community forums

For Django-specific issues:
- Check Django deployment documentation
- Review error logs
- Test locally first

## Additional Notes

- Hostinger may have specific Python version requirements
- Some features may require specific Apache modules
- File size limits may apply (check Hostinger limits)
- Consider using a CDN for static files in production
- Monitor server resources and optimize as needed

