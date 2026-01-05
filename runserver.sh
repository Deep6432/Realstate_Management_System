#!/bin/bash
# Run Django development server on port 8001 (or specified port)

PORT=${1:-8001}

echo "Starting Django development server on port $PORT..."
echo "Access the application at: http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"
echo ""

python manage.py runserver $PORT


