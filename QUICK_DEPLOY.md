# Quick Deployment Checklist for Hostinger

## Pre-Deployment (Local)

1. ✅ Generate new SECRET_KEY
2. ✅ Create `.env` file with production settings
3. ✅ Set `DEBUG=False`
4. ✅ Update `ALLOWED_HOSTS` with your domain
5. ✅ Test locally with production settings

## Upload to Hostinger

1. Upload all files to `public_html` (except `db.sqlite3`, `__pycache__`, `.env`, `venv`)
2. Create `.env` file on server with production credentials
3. Upload `.env` file securely

## Server Setup

1. **Create Virtual Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Migrations:**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. **Collect Static Files:**
   ```bash
   python manage.py collectstatic --noinput
   ```

5. **Set Permissions:**
   ```bash
   chmod -R 755 staticfiles media
   chmod 644 .htaccess .env
   ```

## Start Application

### Option 1: Hostinger Python App
- Go to **Advanced** → **Python App**
- Set App File: `realestate_project/wsgi.py`
- Startup Command: `gunicorn --config gunicorn_config.py realestate_project.wsgi:application`

### Option 2: Manual Gunicorn
```bash
source venv/bin/activate
gunicorn --config gunicorn_config.py realestate_project.wsgi:application
```

## Verify

- [ ] Website loads at your domain
- [ ] Static files (CSS, JS) load correctly
- [ ] Admin login works at `/login/`
- [ ] Property listings display
- [ ] Image uploads work
- [ ] Search functionality works

## Environment Variables (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_ENGINE=mysql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
SECURE_SSL_REDIRECT=False
```

## Common Issues

**Static files not loading?**
- Run: `python manage.py collectstatic --noinput`
- Check permissions: `chmod -R 755 staticfiles`

**500 Error?**
- Check `.env` file exists and has correct values
- Check error logs in Hostinger panel
- Temporarily set `DEBUG=True` to see errors

**Database error?**
- Verify MySQL credentials in `.env`
- Ensure database exists and user has permissions

**Gunicorn not starting?**
- Check if port is available
- Verify virtual environment is activated
- Check `gunicorn_config.py` settings

