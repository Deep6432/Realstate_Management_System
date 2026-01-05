#!/bin/bash
# Deployment script for Hostinger

echo "=========================================="
echo "Real Estate Management - Deployment Script"
echo "=========================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install/update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found!"
    echo "Please create .env file with production settings"
    echo "See .env.example for reference"
    exit 1
fi

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Set permissions
echo "Setting file permissions..."
chmod -R 755 staticfiles
chmod -R 755 media
chmod 644 .htaccess
chmod 644 .env

# Create media directory if it doesn't exist
if [ ! -d "media" ]; then
    echo "Creating media directory..."
    mkdir -p media/property_images
    chmod -R 755 media
fi

echo ""
echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Verify .env file has correct production settings"
echo "2. Ensure DEBUG=False in .env"
echo "3. Start Gunicorn:"
echo "   gunicorn --config gunicorn_config.py realestate_project.wsgi:application"
echo "4. Or use Hostinger Python App interface to start the app"
echo "5. Test your website at your domain"
echo ""


