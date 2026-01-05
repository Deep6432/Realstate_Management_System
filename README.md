# Real Estate Inventory Management System

A complete Node.js/Express.js application for managing real estate properties with advanced search, filtering, and admin dashboard.

## 🚀 Features

- ✅ Property management (CRUD operations)
- ✅ Multiple image uploads per property
- ✅ Advanced search and filtering
- ✅ Admin dashboard with statistics
- ✅ User authentication
- ✅ Responsive design
- ✅ SQLite/MySQL database support

## 📋 Prerequisites

- Node.js 14+ and npm
- SQLite (for local development) or MySQL (for production)
- Git (optional)

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=3000
DB_ENGINE=sqlite
# For MySQL, use:
# DB_ENGINE=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=realestate_db
# DB_USER=root
# DB_PASSWORD=your_password
SESSION_SECRET=your-random-secret-key
ADMIN_USERNAME=Ajay
ADMIN_PASSWORD=Ajay@2026
```

### 3. Run the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The application will be available at: `http://localhost:3000`

## 📁 Project Structure

```
.
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── propertyController.js # Property CRUD operations
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # File upload configuration
├── models/
│   ├── Property.js          # Property model
│   ├── PropertyImage.js     # Property image model
│   ├── User.js              # User model
│   └── index.js             # Model associations
├── routes/
│   └── index.js             # All routes
├── views/
│   ├── partials/            # Shared templates
│   └── properties/           # Property pages
├── public/                   # Static files
│   ├── css/
│   ├── js/
│   └── images/
├── uploads/                  # Uploaded files
│   └── property_images/
├── server.js                 # Main server file
├── package.json
└── .env                      # Environment variables
```

## 🔑 Default Admin Credentials

- **Username:** Ajay
- **Password:** Ajay@2026

(Change these in `.env` file)

## 📚 API Endpoints

### Public Routes
- `GET /` - Homepage
- `GET /properties` - Property listing with filters
- `GET /property/:id` - Property detail page
- `GET /api/search?q=query` - AJAX search API

### Auth Routes
- `GET /login` - Login page
- `POST /login` - Login submission
- `GET /logout` - Logout

### Admin Routes (Protected)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/property/add` - Add property form
- `POST /admin/property/add` - Create property
- `GET /admin/property/:id/edit` - Edit property form
- `POST /admin/property/:id/edit` - Update property
- `GET /admin/property/:id/delete` - Delete confirmation
- `POST /admin/property/:id/delete` - Delete property

## 🗄️ Database Models

### Property
- property_type (ENUM)
- city (STRING)
- khasra_number (STRING)
- full_address (TEXT)
- size (DECIMAL)
- size_unit (ENUM)
- description (TEXT)
- status (ENUM)
- created_at, updated_at

### PropertyImage
- property_id (INTEGER, Foreign Key)
- image (STRING - filename)
- uploaded_at (DATE)

### User
- username (STRING)
- email (STRING)
- password (STRING - hashed)
- is_admin (BOOLEAN)
- created_at, updated_at

## 🔧 Technologies Used

- **Express.js** - Web framework
- **Sequelize** - ORM for SQLite/MySQL
- **EJS** - Template engine
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **connect-flash** - Flash messages

## 🚀 Deployment

### For Production:

1. Set `NODE_ENV=production` in `.env`
2. Update database credentials
3. Set a strong `SESSION_SECRET`
4. Use PM2 or similar process manager:

```bash
npm install -g pm2
pm2 start server.js --name realestate
pm2 save
pm2 startup
```

## 📝 Notes

- Images are stored in `uploads/property_images/`
- Static files are served from `public/`
- Sessions are stored in memory (use Redis for production)
- Database tables are auto-created on first run
- SQLite is used by default for local development

## 🐛 Troubleshooting

### Database Connection Error
- Check database credentials in `.env`
- Verify database exists
- For SQLite, ensure write permissions

### Images Not Uploading
- Check `uploads/property_images/` directory exists
- Verify file permissions
- Check `MAX_FILE_SIZE` in `.env`

### Session Issues
- Clear browser cookies
- Check `SESSION_SECRET` is set
- Verify session middleware is configured

## 📄 License

ISC

---

**Built with Node.js and Express.js**
