#!/bin/bash
# Start script for Gunicorn on Hostinger

# Activate virtual environment
source venv/bin/activate

# Start Gunicorn
gunicorn --config gunicorn_config.py realestate_project.wsgi:application


