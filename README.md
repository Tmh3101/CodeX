# 📚 CodeX - Library Management System

Hệ thống quản lý thư viện toàn diện với giao diện hiện đại, tích hợp Supabase Authentication và Storage, cùng với tính năng thống kê chi tiết.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FC084?style=flat&logo=supabase)](https://supabase.com/)

---

## 🌟 Tính năng chính

### 👤 Cho Độc giả (Reader)

- 🔍 **Tìm kiếm & Duyệt sách** - Tìm kiếm theo tiêu đề, tác giả, thể loại
- 📖 **Mượn sách online** - Gửi yêu cầu mượn sách với số lượng
- 📊 **Lịch sử mượn** - Theo dõi tất cả sách đã mượn, trạng thái
- 👨‍💼 **Quản lý hồ sơ** - Cập nhật thông tin cá nhân, đổi mật khẩu, upload avatar
- 🔔 **Thông báo** - Theo dõi trạng thái yêu cầu mượn

### 🏢 Cho Nhân viên (Staff)

- 📚 **Quản lý sách** - CRUD operations với upload cover image
- ✅ **Duyệt mượn sách** - Phê duyệt/từ chối yêu cầu mượn với ghi chú
- 🔄 **Xác nhận trả sách** - Đánh dấu sách đã được trả
- 👥 **Quản lý người dùng** - Xem, chỉnh sửa thông tin độc giả
- 🏷️ **Quản lý thông tin** - Categories, Authors, Publishers
- 📊 **Thống kê chi tiết** - Dashboard với biểu đồ Chart.js

### 📈 Hệ thống thống kê (Staff)

- 📊 **Thống kê mượn/trả** - Xu hướng mượn, tỷ lệ trả đúng hạn/trễ hạn
- 📚 **Thống kê sách** - Top sách được mượn, phân bố theo thể loại
- 👥 **Thống kê người dùng** - Phân tích hoạt động, đăng ký mới
- 📅 **Báo cáo linh hoạt** - Theo tuần, tháng, quý, năm

---

## 🏗️ Kiến trúc hệ thống

```
CodeX/
├── 🖥️ backend/                    # Node.js + Express Backend
│   ├── app/
│   │   ├── controllers/           # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── book.controller.js
│   │   │   ├── borrow.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── statistics.controller.js
│   │   │   └── ...
│   │   ├── models/                # MongoDB Mongoose models
│   │   │   ├── user.model.js
│   │   │   ├── book.model.js
│   │   │   ├── borrow.model.js
│   │   │   ├── reader.model.js
│   │   │   ├── staff.model.js
│   │   │   └── ...
│   │   ├── services/              # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── book.service.js
│   │   │   ├── borrow.service.js
│   │   │   ├── user.service.js
│   │   │   ├── statistics.service.js
│   │   │   └── ...
│   │   ├── routes/                # API routes
│   │   ├── middlewares/           # Custom middlewares
│   │   ├── enums/                 # Constants & enums
│   │   ├── utils/                 # Utility functions
│   │   │   ├── supabaseClient.js
│   │   │   ├── file.util.js
│   │   │   └── user.util.js
│   │   └── config/                # Configuration
│   ├── seedData/                  # Sample data
│   │   ├── book_data.csv
│   │   └── seedBook.js
│   ├── app.js                     # Express app setup
│   ├── server.js                  # Server entry point
│   └── .env                       # Environment variables
│
├── 🎨 frontend/                   # Vue.js 3 Frontend
│   ├── src/
│   │   ├── components/            # Reusable Vue components
│   │   ├── views/                 # Page components
│   │   │   ├── reader/            # Reader pages
│   │   │   └── staff/             # Staff pages
│   │   │       ├── StatisticsPage.vue
│   │   │       ├── BorrowManagementPage.vue
│   │   │       └── ...
│   │   ├── layouts/               # Layout templates
│   │   │   ├── ReaderLayout.vue
│   │   │   └── StaffLayout.vue
│   │   ├── services/              # API service layer
│   │   │   ├── authService.js
│   │   │   ├── bookService.js
│   │   │   ├── borrowService.js
│   │   │   ├── userService.js
│   │   │   ├── statisticsService.js
│   │   │   └── index.js
│   │   ├── router/                # Vue Router config
│   │   └── assets/                # Static assets
│   ├── public/                    # Public files
│   └── vite.config.js            # Vite configuration
│
└── 📚 docs/                      # Documentation
```

---

## 🛠️ Công nghệ sử dụng

### Backend

- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database với Mongoose ODM
- **Supabase Auth** - Authentication service
- **Supabase Storage** - File storage (avatars, book covers)
- **JWT** - Access & Refresh tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware

### Frontend

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool và dev server
- **Vue Router** - Official router cho SPA
- **Tailwind CSS** - Utility-first CSS framework
- **PrimeIcons** - Icon library
- **Axios** - HTTP client
- **Chart.js + vue-chartjs** - Biểu đồ thống kê
- **Lodash** - Utility library

---

## 🚀 Hướng dẫn cài đặt

### 📋 Yêu cầu hệ thống

- **Node.js** 18.0.0+
- **MongoDB** 6.0+
- **npm** hoặc **yarn**
- **Supabase Account** (để tạo project)

### 1️⃣ Clone repository

```bash
git clone https://github.com/your-username/CodeX.git
cd CodeX
```

### 2️⃣ Thiết lập Supabase

1. Tạo project mới trên [Supabase](https://supabase.com)
2. Lấy các thông tin:
   - Project URL
   - Anon Key
   - Service Role Key
3. Tạo Storage bucket có tên `book-covers` và `avatars`

### 3️⃣ Cài đặt Backend

```bash
cd backend
npm install
```

#### Tạo file `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/codex_library

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Khởi động MongoDB

```bash
# Windows
mongod

# macOS (với Homebrew)
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo systemctl start mongod
```

#### Chạy Backend

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

### 4️⃣ Cài đặt Frontend

```bash
cd ../frontend
npm install
```

#### Tạo file `.env`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=CodeX Library
VITE_APP_VERSION=1.0.0

# Supabase (cho direct access nếu cần)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Cài đặt Chart.js cho thống kê

```bash
npm install chart.js vue-chartjs
```

#### Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

---

## 🎯 Tài khoản mặc định

Hệ thống sẽ tự động tạo tài khoản staff mặc định khi khởi động lần đầu:

```
Email: staff001@gmail.com
Password: <nKyKN72
Role: Staff
```

---

## 📦 API Documentation

### 🔐 Authentication Endpoints

```http
POST   /api/auth/register          # Đăng ký tài khoản mới
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/refresh-token     # Refresh access token
GET    /api/auth/profile           # Lấy thông tin user hiện tại
POST   /api/auth/logout            # Đăng xuất
POST   /api/auth/change-password   # Đổi mật khẩu
```

### 📚 Books Management

```http
GET    /api/books                  # Lấy danh sách sách (có search, filter)
GET    /api/books/:bookId          # Lấy chi tiết sách
POST   /api/books                  # Thêm sách mới (Staff only)
PUT    /api/books/:bookId          # Cập nhật sách (Staff only)
DELETE /api/books/:bookId          # Xóa sách (Staff only)
```

### 👥 User Management

```http
GET    /api/users                  # Lấy danh sách users (Staff only)
GET    /api/users/:userId          # Lấy thông tin user
PUT    /api/users/:userId          # Cập nhật user (Staff only)
PUT    /api/users/profile          # Cập nhật profile cá nhân
DELETE /api/users/:userId          # Xóa user (Staff only)
POST   /api/users/upload-avatar    # Upload avatar
DELETE /api/users/delete-avatar    # Xóa avatar
```

### 📖 Borrow Management

```http
GET    /api/borrows                # Lấy danh sách mượn sách
POST   /api/borrows                # Tạo yêu cầu mượn sách
GET    /api/borrows/:borrowId      # Lấy chi tiết mượn
PUT    /api/borrows/:borrowId/approve    # Duyệt mượn (Staff only)
PUT    /api/borrows/:borrowId/reject     # Từ chối mượn (Staff only)
PUT    /api/borrows/:borrowId/return     # Xác nhận trả (Staff only)
GET    /api/borrows/reader/:readerId     # Lịch sử mượn của reader
```

### 📊 Statistics

```http
GET    /api/statistics/borrows?timeRange=month   # Thống kê mượn/trả
GET    /api/statistics/books                     # Thống kê sách
GET    /api/statistics/users?timeRange=month     # Thống kê users
GET    /api/statistics/dashboard                 # Tổng quan dashboard
```

### 🏷️ Library Info Management

```http
GET    /api/categories             # Lấy danh sách thể loại
POST   /api/categories             # Thêm thể loại (Staff only)
PUT    /api/categories/:id         # Cập nhật thể loại (Staff only)
DELETE /api/categories/:id         # Xóa thể loại (Staff only)

GET    /api/authors                # Lấy danh sách tác giả
POST   /api/authors                # Thêm tác giả (Staff only)
PUT    /api/authors/:id            # Cập nhật tác giả (Staff only)
DELETE /api/authors/:id            # Xóa tác giả (Staff only)

GET    /api/publishers             # Lấy danh sách nhà xuất bản
POST   /api/publishers             # Thêm NXB (Staff only)
PUT    /api/publishers/:id         # Cập nhật NXB (Staff only)
DELETE /api/publishers/:id         # Xóa NXB (Staff only)
```

---

## 🔐 Authentication Flow

1. **Đăng ký**: User đăng ký qua `/api/auth/register` → Tạo user trong Supabase Auth + MongoDB
2. **Đăng nhập**: User login qua `/api/auth/login` → Verify với Supabase → Trả về JWT tokens
3. **Authorization**: Frontend gửi `Authorization: Bearer <token>` trong headers
4. **Refresh Token**: Khi access token hết hạn → Gọi `/api/auth/refresh-token`
5. **Role-based Access**: Middleware check user role (Reader/Staff) cho từng endpoint

---

## 📊 Phân quyền User

### Reader Role

- ✅ Xem danh sách sách, tìm kiếm
- ✅ Tạo yêu cầu mượn sách
- ✅ Xem lịch sử mượn của mình
- ✅ Cập nhật profile, đổi mật khẩu
- ✅ Upload/delete avatar
- ❌ Không thể truy cập Staff pages

### Staff Role

- ✅ Tất cả quyền của Reader
- ✅ Quản lý sách (CRUD)
- ✅ Duyệt/từ chối yêu cầu mượn
- ✅ Xác nhận trả sách
- ✅ Quản lý users
- ✅ Xem thống kê chi tiết
- ✅ Quản lý categories/authors/publishers

---

## 🎨 Frontend Routes

```
# Public Routes
/                     # Landing page
/login               # Đăng nhập
/register            # Đăng ký

# Reader Routes
/reader/dashboard    # Reader dashboard
/reader/books        # Danh sách sách
/reader/borrows      # Lịch sử mượn
/profile             # Profile cá nhân

# Staff Routes
/staff/dashboard     # Staff dashboard
/staff/books         # Quản lý sách
/staff/borrows       # Quản lý mượn sách
/staff/users         # Quản lý users
/staff/statistics    # Thống kê
/staff/library-info  # Quản lý thông tin thư viện
```

---

## 🗄️ Database Schema

### User Model

```javascript
{
  _id: String,          // Supabase UUID
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  avatar: String,       // Supabase Storage URL
  role: String,         // 'reader' | 'staff'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model

```javascript
{
  bookId: String,       // Auto-generated unique ID
  title: String,
  authors: [ObjectId],  // Reference to Author
  categories: [ObjectId], // Reference to Category
  publisher: ObjectId,  // Reference to Publisher
  publishedYear: Number,
  isbn: String,
  description: String,
  quantity: Number,
  coverUrl: String,     // Supabase Storage URL
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Borrow Model

```javascript
{
  readerId: ObjectId,   // Reference to Reader
  bookId: String,       // Reference to Book
  quantity: Number,
  borrowDate: Date,
  returnDate: Date,     // Expected return date
  actualReturnDate: Date, // Actual return date
  status: String,       // 'pending'|'approved'|'rejected'|'returned'
  note: String,
  approvedStaff: ObjectId, // Reference to Staff
  returnedStaff: ObjectId, // Reference to Staff
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### API Testing với Postman

1. Import collection từ `docs/CodeX_API_Collection.json`
2. Set environment variables:
   - `base_url`: `http://localhost:5000`
   - `access_token`: Token từ login response

### Frontend Testing

```bash
cd frontend
npm run test:unit
```

---

## 🐛 Troubleshooting

### ❗ Lỗi kết nối MongoDB

```bash
# Kiểm tra MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB port
netstat -an | grep 27017
```

### ❗ Lỗi Supabase Connection

- Kiểm tra SUPABASE_URL và keys trong `.env`
- Verify bucket names trong Supabase Storage
- Check network connectivity

### ❗ Lỗi CORS

```env
# Backend .env
CORS_ORIGIN=http://localhost:3000

# Hoặc cho multiple origins
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### ❗ Lỗi File Upload

```bash
# Check upload directory permissions
mkdir uploads
chmod 755 uploads

# Check Supabase bucket policies
```

---

## 🔄 Seeding Data

Hệ thống có script seed để tạo dữ liệu mẫu:

```bash
cd backend/seedData
node seedBook.js
```

File `book_data.csv` chứa dữ liệu sách mẫu.

---

## 📋 Scripts Available

### Backend Scripts

```bash
npm run dev        # Development với nodemon
npm start          # Production
npm test           # Run tests
npm run seed       # Seed sample data
```

### Frontend Scripts

```bash
npm run dev        # Development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run test:unit  # Unit tests
```

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📋 Changelog

### v1.0.0 (2025-08-05)

- ✨ Hoàn thành hệ thống quản lý thư viện cơ bản
- 🔐 Tích hợp Supabase Auth & Storage
- 📊 Module thống kê với Chart.js
- 👥 Phân quyền Reader/Staff hoàn chỉnh
- 📱 Responsive UI với Tailwind CSS
- 🎨 Enhanced DetailModal cho BorrowManagement

---

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript Framework
- [Node.js](https://nodejs.org/) - JavaScript Runtime
- [MongoDB](https://mongodb.com/) - NoSQL Database
- [Supabase](https://supabase.com/) - Backend as a Service
- [Chart.js](https://chartjs.org/) - JavaScript Charts
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

⭐ **Nếu dự án này hữu ích, hãy cho chúng tôi một star trên GitHub!**
