# 🛒 ShopNow — Full Stack E-Commerce Application

A complete, production-ready e-commerce platform built with React (Vite), Node.js/Express, Prisma ORM, and PostgreSQL.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcryptjs |
| State | Redux Toolkit + Context |
| HTTP | Axios |
| Image Upload | Cloudinary / Local multer |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm or yarn

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

### 1. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` with your values:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecommerce_db"
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 2. Create Database
```bash
# In psql or pgAdmin, create the database
createdb ecommerce_db
```

### 3. Run Prisma Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed the Database
```bash
npm run seed
```

This creates:
- **Admin:** admin@store.com / admin123
- **User:** user@example.com / user123
- 6 categories
- 12 sample products

### 5. Start Backend
```bash
npm run dev       # development (with nodemon)
npm start         # production
```
Backend runs at: **http://localhost:5000**

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── config/
│   │   ├── database.js          # Prisma client singleton
│   │   └── cloudinary.js        # Multer + Cloudinary config
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   ├── productController.js # CRUD + search + filters
│   │   ├── categoryController.js
│   │   ├── cartController.js    # Add, update, remove items
│   │   ├── orderController.js   # Create, track, admin manage
│   │   ├── reviewController.js  # Create, delete reviews
│   │   └── adminController.js   # Dashboard stats, user mgmt
│   ├── middleware/
│   │   ├── auth.js              # JWT protect, adminOnly
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validate.js          # Express-validator helper
│   ├── prisma/
│   │   ├── schema.prisma        # All DB models + relations
│   │   └── seed.js              # Sample data seeder
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── helpers.js
│   ├── uploads/                 # Local image storage fallback
│   ├── server.js                # Express app entry point
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # Axios instance + interceptors
    │   ├── components/
    │   │   ├── common/          # Spinner, StarRating, Pagination
    │   │   ├── layout/          # Navbar, Footer, AdminLayout
    │   │   └── product/         # ProductCard, ProductGrid
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── OrderDetailPage.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProducts.jsx
    │   │       ├── AdminOrders.jsx
    │   │       ├── AdminUsers.jsx
    │   │       └── AdminCategories.jsx
    │   ├── store/               # Redux Toolkit slices
    │   │   ├── store.js
    │   │   ├── authSlice.js
    │   │   └── cartSlice.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🔌 API Endpoints

### Auth `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Create account |
| POST | `/login` | Public | Sign in |
| GET | `/me` | User | Get profile |
| PUT | `/profile` | User | Update profile |
| PUT | `/password` | User | Change password |

### Products `/api/products`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | List with filters/pagination |
| GET | `/featured` | Public | Featured products |
| GET | `/:id` | Public | Single product |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Soft delete |

**Query params for GET /:** `page`, `limit`, `category`, `search`, `minPrice`, `maxPrice`, `sort`, `order`, `featured`

### Categories `/api/categories`
Full CRUD, admin-only for write operations.

### Cart `/api/cart`
All routes require authentication. GET, POST (add), PUT (update qty), DELETE (remove item/clear).

### Orders `/api/orders`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | User | Place order from cart |
| GET | `/my-orders` | User | My order history |
| GET | `/:id` | User | Order details |
| GET | `/` | Admin | All orders |
| PUT | `/:id/status` | Admin | Update status |

### Reviews `/api/reviews`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/product/:productId` | Public | Product reviews |
| POST | `/product/:productId` | User | Submit review |
| DELETE | `/:id` | User/Admin | Delete review |

### Admin `/api/admin`
All routes require Admin role.
- `GET /stats` — Dashboard stats
- `GET /users` — All users
- `PUT /users/:id` — Change role
- `DELETE /users/:id` — Delete user

---

## 🗄️ Database Schema

```
User ─── Cart ─── CartItem ─── Product ─── Category
  │                                  │
  └── Order ─── OrderItem ───────────┘
  │
  └── Review ─── Product
```

---

## 🎨 Features

### Customer Features
- ✅ Browse products with search, filter by category, price range
- ✅ Product details with image gallery, reviews, ratings
- ✅ Shopping cart (persistent per user)
- ✅ Checkout with shipping address
- ✅ Order history and tracking
- ✅ User profile management
- ✅ Write product reviews (one per product)
- ✅ Pagination throughout

### Admin Features
- ✅ Dashboard with key metrics and charts
- ✅ Full product CRUD (name, price, stock, images, tags)
- ✅ Order management + status updates
- ✅ User management + role assignments
- ✅ Category management

### Technical Features
- ✅ JWT authentication with refresh on reload
- ✅ Role-based access control (USER / ADMIN)
- ✅ Rate limiting on auth endpoints
- ✅ Helmet security headers
- ✅ Global error handling middleware
- ✅ Prisma transactions for order creation
- ✅ Stock validation before checkout
- ✅ Automatic cart clearing after order
- ✅ Responsive design (mobile-first)

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- Auth endpoints rate-limited (20 req/15min)
- API endpoints rate-limited (200 req/15min)
- Helmet sets secure HTTP headers
- CORS restricted to frontend URL
- Soft delete for products (never lost from orders)

---

## 🌱 Adding Cloudinary (Image Upload)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Add credentials to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```
3. Restart backend — file uploads now go to Cloudinary automatically

Without Cloudinary, images are stored locally in `/backend/uploads/`.

---

## 🚀 Production Deployment

### Backend (e.g., Railway, Render, Heroku)
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm start
```

### Frontend (e.g., Vercel, Netlify)
```bash
npm run build
# Deploy the dist/ folder
```
Update `FRONTEND_URL` in backend `.env` and API base URL in frontend `vite.config.js`.

---

## 📝 License

MIT — use freely for personal or commercial projects.
