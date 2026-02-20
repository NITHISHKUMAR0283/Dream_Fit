# DreamFit - E-commerce Website for Dress Shop

A complete, modern e-commerce website built for a dress shop with React.js frontend and Node.js backend. Features include product catalog, shopping cart, admin panel, UPI payments, and mobile-responsive design.

## ✨ Features

### Customer Features
- 🏠 **Modern Homepage** with hero section, featured products, and categories
- 🛍️ **Product Catalog** with advanced filtering and sorting
- 🔍 **Product Search** with text-based search functionality
- 👗 **Product Details** with image gallery and size/color selection
- 🛒 **Shopping Cart** with quantity management
- 💳 **UPI Payments** with QR code generation
- 📱 **Mobile Responsive** design for all devices
- 👤 **User Authentication** with secure JWT tokens
- 📦 **Order Tracking** and order history
- ⭐ **Product Reviews** and ratings

### Admin Features
- 📊 **Admin Dashboard** with sales analytics
- ➕ **Product Management** (Add, Edit, Delete products)
- 📸 **Image Upload** with Cloudinary integration
- 📋 **Order Management** and status updates
- 👥 **User Management** capabilities
- 📈 **Sales Reports** and insights

### Technical Features
- 🚀 **High Performance** with optimized images and caching
- 🔒 **Secure** with input validation and OWASP best practices
- 📱 **PWA Ready** for mobile app-like experience
- 🌐 **SEO Optimized** with proper meta tags
- 🔄 **Real-time Updates** for order status
- 📧 **Email Notifications** for orders and updates

## 🛠️ Technology Stack

### Frontend
- **React.js 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **React Router** for client-side routing
- **Axios** for API communication
- **Lucide React** for beautiful icons
- **QRCode.react** for UPI QR code generation

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for better development experience
- **MongoDB** with Mongoose ODM
- **JWT** for secure authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image storage and optimization
- **Multer** for file upload handling
- **Helmet** and rate limiting for security

### Deployment (Free Tier)
- **Frontend:** Vercel or Netlify
- **Backend:** Railway, Render, or Heroku
- **Database:** MongoDB Atlas (Free M0 cluster)
- **Images:** Cloudinary (Free tier)
- **Domain:** Free subdomain or custom domain

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- MongoDB Atlas account (free)
- Cloudinary account (free)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd DreamFit
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configurations
# MongoDB Atlas connection string
# Cloudinary credentials
# JWT secret
# UPI ID for payments
```

#### Backend Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dreamfit?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# UPI Configuration
UPI_ID=your-upi-id@paytm
UPI_MERCHANT_NAME=DreamFit Store

# Admin Configuration
ADMIN_EMAIL=admin@dreamfit.com
ADMIN_PASSWORD=admin123
```

```bash
# Start backend development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm start
```

The frontend will run on `http://localhost:3000`

## 📱 Usage Guide

### For Store Owners (Admin)

1. **Initial Setup:**
   - Register an admin account or use default credentials
   - Configure store settings and payment details
   - Upload store logo and branding

2. **Managing Products:**
   - Go to Admin Panel → Products
   - Click "Add Product" to add new dresses
   - Upload high-quality images (recommended: 800x1200px)
   - Set prices, sizes, colors, and descriptions
   - Mark products as "Featured" for homepage display

3. **Managing Orders:**
   - Monitor incoming orders in real-time
   - Update order status (Processing → Shipped → Delivered)
   - Send notifications to customers

4. **Analytics:**
   - View sales reports and popular products
   - Track customer behavior and preferences

### For Customers

1. **Shopping:**
   - Browse products by category or use search
   - Filter by size, color, price range
   - View detailed product information
   - Add items to cart with preferred size/color

2. **Checkout:**
   - Review cart items and total
   - Enter shipping address
   - Choose UPI payment method
   - Scan QR code to complete payment
   - Receive order confirmation

3. **Account Management:**
   - Create account for faster checkout
   - View order history and tracking
   - Update profile and addresses

## 🚀 Deployment Guide

### 1. MongoDB Atlas Setup (Free)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (M0 Free tier)
3. Create database user and get connection string
4. Whitelist your IP addresses (or use 0.0.0.0/0 for all)

### 2. Cloudinary Setup (Free)

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Configure upload presets if needed

### 3. Backend Deployment

#### Option A: Railway (Recommended)
1. Create account at [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy with automatic builds

#### Option B: Render
1. Create account at [Render](https://render.com/)
2. Create new Web Service from GitHub
3. Configure build and start commands
4. Add environment variables

#### Option C: Heroku
1. Create account at [Heroku](https://heroku.com/)
2. Install Heroku CLI
3. Create new app and deploy

```bash
# Heroku deployment commands
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-connection-string
# Add other environment variables
git push heroku main
```

### 4. Frontend Deployment

#### Option A: Vercel (Recommended)
1. Create account at [Vercel](https://vercel.com/)
2. Connect your GitHub repository
3. Deploy with automatic builds
4. Configure API URL environment variable

#### Option B: Netlify
1. Create account at [Netlify](https://netlify.com/)
2. Drag and drop build folder or connect GitHub
3. Configure build settings

```bash
# Build for production
npm run build

# The build folder can be deployed to any static hosting
```

### 5. Domain Configuration

- **Free Options:** Use provided subdomains (vercel.app, netlify.app, railway.app)
- **Custom Domain:** Configure DNS settings to point to your hosting provider

## 🔧 Development

### Project Structure

```
DreamFit/
├── frontend/                 # React.js frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── common/      # Header, Footer, Layout
│   │   │   ├── product/     # Product-related components
│   │   │   ├── cart/        # Shopping cart components
│   │   │   └── auth/        # Authentication components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript type definitions
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── types/           # TypeScript types
│   └── package.json
└── README.md
```

### Available Scripts

#### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint
```

#### Backend
```bash
npm run dev        # Start development server with nodemon
npm run build      # Compile TypeScript
npm start          # Start production server
npm test           # Run tests
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

#### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

#### Upload
- `POST /api/upload/image` - Upload single image (admin)
- `POST /api/upload/images` - Upload multiple images (admin)

## 🎨 Customization

### Styling
- Edit `frontend/tailwind.config.js` for custom colors and themes
- Modify components in `frontend/src/components/` for layout changes
- Update `frontend/src/index.css` for global styles

### Branding
- Replace logo and favicon in `frontend/public/`
- Update store name and details in components
- Customize email templates and notifications

### Features
- Add new product categories in backend models
- Implement additional payment methods
- Add product reviews and ratings
- Integrate with inventory management systems

## 🔒 Security

### Implemented Security Measures
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js for security headers
- JWT token authentication
- Password hashing with bcrypt
- Environment variable protection

### Additional Recommendations
- Use HTTPS in production
- Implement proper logging and monitoring
- Regular security audits
- Keep dependencies updated
- Use strong passwords and 2FA

## 📞 Support

### Getting Help
- Check the [Issues](link-to-issues) section for common problems
- Review the documentation thoroughly
- Contact support for technical assistance

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000 or 5000
npx kill-port 3000
npx kill-port 5000
```

**Environment Variables Not Loading:**
- Ensure .env file is in the correct directory
- Restart the development server
- Check for typos in variable names

**Database Connection Issues:**
- Verify MongoDB Atlas connection string
- Check IP whitelist settings
- Ensure database user has proper permissions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for beautiful styling utilities
- MongoDB Atlas for reliable database hosting
- Cloudinary for image management
- All the open-source contributors

---

**Built with ❤️ for small businesses to grow online**