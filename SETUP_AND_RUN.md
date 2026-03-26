# 🚀 University Management System - Complete Setup & Run Guide

## ✅ Current Setup Status
- ✓ MongoDB connected and configured   
- ✓ Backend server (Express) configured
- ✓ Frontend (React + TypeScript) configured
- ✓ Authentication system ready
- ✓ All routes and models set up
- ✓ Test database with seed data available

---

## 📋 Prerequisites Check
Before starting, ensure you have:
- [x] Node.js (v18+) and npm (v9+)
- [x] MongoDB Atlas account with connection string
- [x] .env file with all credentials (verified ✓)
- [x] Cloudinary credentials in .env

---

## 🔧 Setup Instructions

### Step 1: Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd .. (go back to root)
npm install
```

---

### Step 2: Seed Database with Test Data

Run this command to populate MongoDB with test users and data:

```bash
cd backend
npm run seed
```

**This will create:**
- 3 Universities/Colleges
- 5 Programs
- 10+ Courses  
- Test Users with different roles:
  - **University Admin** - Can manage all colleges
  - **College Admin** - Can manage courses and faculty
  - **Students** - Can view courses and submissions

---

### Step 3: Start the Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

The backend will be available at: `http://localhost:5000`

**Health Check:** Visit `http://localhost:5000/health`

---

### Step 4: Start the Frontend (in a new terminal)

```bash
npm run dev
```

**Expected Output:**
```
VITE v7.2.4  ready in XXX ms
➜  Local:   http://localhost:5173/
```

Frontend will open at: `http://localhost:5173`

---

## 👤 Test Credentials

After running `npm run seed`, you can login with these test accounts:

### University Admin
- **Email:** `admin@university.edu`
- **Password:** `password123`
- **Role:** University Admin (manage all colleges)

### College Admin
- **Email:** `james@eng.edu`  
- **Password:** `password123`
- **Role:** College Admin (manage courses & faculty)

### Student
- **Email:** `alice@student.edu`
- **Password:** `password123`
- **Role:** Student (view courses, attendance, results)

---

## 🎯 Feature Testing Checklist

### ✓ Login System
- [ ] Login with university admin credentials
- [ ] Login with college admin credentials  
- [ ] Login with student credentials
- [ ] Error message appears for wrong password
- [ ] Loader shows while signing in

### ✓ University Admin Dashboard
- [ ] View total colleges, students, faculty, programs
- [ ] View list of all colleges
- [ ] Add new college (button works)
- [ ] Edit college details (button works)
- [ ] Delete college (button works)
- [ ] View programs list
- [ ] Add new program (button works)

### ✓ College Admin Dashboard
- [ ] View college statistics
- [ ] View list of courses
- [ ] Add new course (button works)
- [ ] Edit course details (button works)
- [ ] View faculty members
- [ ] View students enrolled

### ✓ Student Dashboard
- [ ] View enrolled courses
- [ ] View attendance percentage
- [ ] View submitted assignments
- [ ] View pending assignments
- [ ] View grades and results
- [ ] Submit assignment file
- [ ] Download course materials

### ✓ User Authentication
- [ ] Login stores token in localStorage
- [ ] Logout removes token and user
- [ ] Protected routes redirect to login when not authenticated
- [ ] Token is sent with API requests

---

## 🔌 API Endpoints Test

### Authentication
```bash
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
```

### University Admin Routes
```bash
GET /api/university/stats
GET /api/university/colleges
POST /api/university/colleges
PUT /api/university/colleges/:id
DELETE /api/university/colleges/:id
GET /api/university/programs
```

### College Admin Routes
```bash
GET /api/college/stats
GET /api/college/courses
POST /api/college/courses
PUT /api/college/courses/:id
```

### Student Routes
```bash
GET /api/student/dashboard
GET /api/student/courses
GET /api/student/attendance
GET /api/student/assignments
```

**Test with curl or Postman:**
```bash
curl -X GET http://localhost:5000/health
```

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Solution:**
1. Verify `.env` file has correct `MONGODB_URI`
2. Check internet connection (MongoDB Atlas requires internet)
3. Ensure IP is whitelisted in MongoDB Atlas (Security > Network Access)
4. Check if MongoDB cluster is running

```bash
# Verify connection
curl -X GET http://localhost:5000/health
```

### Issue: CORS Error
**Solution:**
- Backend CORS is configured for `http://localhost:5173`
- If running on different port, update `FRONTEND_URL` in `.env`

### Issue: Login Not Working
**Solution:**
1. Run seed script to create test users
2. Check browser console (F12) for network errors
3. Verify backend is running on port 5000
4. Check if JWT_SECRET is set in .env

### Issue: "Token is missing" Error
**Solution:**
1. Clear localStorage and login again
2. Check if token is being stored: `localStorage.getItem('token')`
3. Verify auth headers are being sent in API requests

### Issue: Buttons Not Working
**Solution:**
1. Check browser console (F12) for JavaScript errors
2. Verify onClick handlers are connected
3. Ensure state updates are working (React DevTools)
4. Check network tab for API response errors

---

## 📊 Database Collections

After seeding, you'll have these collections in MongoDB:
- `users` - University admin, college admin, and student accounts
- `colleges` - College information
- `programs` - Degree programs
- `courses` - Courses offered
- `attendance` - Student attendance records
- `assignments` - Course assignments
- `results` - Student exam results
- `materials` - Course materials (notes, videos, PDFs)
- `timetables` - Class schedules

---

## 🌐 Deployment Checklist

### Before Deploying to Production:
- [ ] Change JWT_SECRET to a strong random value
- [ ] Update MONGODB_URI to production database
- [ ] Update FRONTEND_URL to production domain
- [ ] Set NODE_ENV=production in .env
- [ ] Update API_URL in frontend config for production backend
- [ ] Test all features on production-like environment
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure proper error logging
- [ ] Set up automated backups for MongoDB

---

## 📱 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React + TypeScript)           │
│  - Login Component                                       │
│  - UniversityAdminDashboard                             │
│  - CollegeAdminDashboard                                │
│  - StudentDashboard                                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Express.js + Node.js)              │
│  - /api/auth         - Authentication routes            │
│  - /api/university   - University admin operations      │
│  - /api/college      - College admin operations         │
│  - /api/student      - Student operations               │
│  - /api/upload       - File upload (Cloudinary)         │
└────────────────────┬────────────────────────────────────┘
                     │ MongoDB Driver
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Database (MongoDB Atlas)                    │
│  - Collections: users, colleges, programs, courses...   │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Next Steps

1. **Run seed script**: `npm run seed`
2. **Start backend**: `npm run dev` (in backend folder)
3. **Start frontend**: `npm run dev` (in root folder)
4. **Test login**: Use test credentials provided above
5. **Test features**: Follow the checklist above
6. **Debug**: Use browser DevTools and network tab

---

## 📞 Support

For issues:
1. Check the Troubleshooting section above
2. Review browser console (F12) for errors
3. Check backend console logs
4. Verify all services are running
5. Ensure MongoDB connection is active

---

**Status:** ✅ All systems ready for launch!
