# Gunicorn configuration file for Hostinger deployment

# Bind to localhost (Apache/Nginx will proxy to this)
bind = "127.0.0.1:8000"

# Number of worker processes (adjust based on server resources)
# Formula: (2 x CPU cores) + 1
workers = 3

# Worker class
worker_class = "sync"

# Worker connections
worker_connections = 1000

# Timeout settings
timeout = 30
keepalive = 2

# Worker recycling (helps prevent memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Preload app for better performance
preload_app = True

# Logging
# Use "-" for stdout/stderr, or specify file paths
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "realestate_project"

# User and group (uncomment and set if running as different user)
# user = "www-data"
# group = "www-data"

# Working directory
# chdir = "/path/to/your/project"

# Environment variables
# raw_env = [
#     'DJANGO_SETTINGS_MODULE=realestate_project.settings',
# ]


