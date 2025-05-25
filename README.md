# 📚 CodeX - Library Borrowing System

A full-stack application for managing library books and borrowing history.

This system includes:

- ✨ **Frontend**: Built with Vue.js (Vite)
- 🚀 **Backend**: Node.js + Express
- 🔐 **Authentication**: Supabase Auth
- ☁️ **Image Storage**: Supabase Storage
- 🧩 **Database**: MongoDB

---

## 🗂️ Project Structure

```
codex/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   ├── app.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── vite.config.js
├── README.md
└── ...
```

---

## 🔧 Tech Stack

### Backend

- Node.js + Express.js
- MongoDB (with Mongoose)
- Supabase Auth (Email login, token management)
- Supabase Storage (Upload and manage images)
- JWT (Access + Refresh Token)

### Frontend

- Vue 3 + Vite
- Vue Router
- Tailwind CSS (or Bootstrap)
- Axios (for API calls)

---

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone https://github.com/your-username/codex.git
cd codex
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Create `.env` file:

```env
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/codex

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=xpervia-public
```

#### Start the backend server

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📦 Backend API Overview

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| POST   | /api/auth/sign-up       | Register user (via Supabase) |
| POST   | /api/auth/sign-in       | Login and get tokens         |
| POST   | /api/auth/refresh-token | Refresh access token         |
| GET    | /api/auth/profile       | Get authenticated user info  |
| POST   | /api/auth/sign-out      | Backend-controlled sign out  |
| POST   | /api/upload             | Upload image to Supabase     |
| GET    | /api/books              | Get list of books            |
| POST   | /api/books/borrow       | Borrow a book (reader only)  |
| GET    | /api/history            | Get user's borrow history    |

> ⚠️ All protected routes require `Authorization: Bearer <access_token>` header.

---

## 🖼 Supabase Storage

- Bucket: `xpervia-public`
- Folder structure: `/book-thumbnails/`, `/avatars/`
- All uploads handled by backend and private keys

---

## 🔐 Authentication Flow

1. User signs up/login via backend (email + password)
2. Backend talks to Supabase Auth API
3. Supabase returns `access_token` and `refresh_token`
4. Backend uses these tokens for user session management
5. Frontend stores tokens in memory or localStorage
6. Access token expires → frontend requests `/refresh-token` from backend

---

## 📚 User Roles

- **Reader**

  - View books
  - Borrow books
  - View history

- **Staff**
  - Add/edit/delete books
  - Manage borrow requests
  - Manage users

---

## 🧪 Development Tips

- Use Postman or Thunder Client to test backend API.
- Don’t expose Supabase keys on frontend.
- Token handling is done entirely on backend for security.

---

## 📌 Future Improvements

- Role-based access control (RBAC)
- Email confirmation check
- Admin dashboard
- Notification system for borrow status

---

## 📝 License

MIT
