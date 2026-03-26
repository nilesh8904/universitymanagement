<<<<<<< HEAD
# 🎓 University Management System

A comprehensive, full-stack university management system with role-based access control, built with React, Node.js, MongoDB, and Cloudinary.

![University Management System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blue)
![React](https://img.shields.io/badge/Frontend-React%2018-blue)
![Node](https://img.shields.io/badge/Backend-Node.js%2020-green)

## ✨ Features

### 🔐 Authentication System
- **JWT-based authentication** with secure token management
- **Role-based access control** (University Admin, College Admin, Student)
- Password hashing with bcrypt
- Persistent login sessions

### 🏫 University Admin Module
- **Dashboard**: Overview of all colleges, students, faculty, and programs
- **College Management**: Add, edit, and manage multiple colleges
- **Program Management**: Define academic programs with degree types and durations
- **Analytics Dashboard**: 
  - Student distribution across colleges
  - Faculty distribution charts
  - Program statistics
  - Visual data representation

### 🏢 College Admin Module
- **Overview Dashboard**: Quick stats on courses, faculty, and assignments
- **Course Management**: Create and manage courses with credits and semesters
- **Faculty Management**: Add faculty with department and specialization details
- **Timetable Creation**: Schedule classes with day, time, room, and faculty assignment
- **Attendance System**: Mark student attendance (present/absent/late) for each course
- **Assignment Management**: 
  - Create assignments with due dates and max marks
  - Upload assignment materials via Cloudinary
  - Grade student submissions
  - Provide feedback

### 🎓 Student Module
- **Personal Dashboard**: View enrolled courses, attendance %, pending assignments, GPA
- **My Courses**: Access all enrolled courses with faculty information
- **Attendance Tracking**: View detailed attendance records for each course
- **Assignment Submission**: 
  - View all assignments with due dates and status
  - Submit assignments with file uploads (Cloudinary)
  - View grades and faculty feedback
  - Track submission status
- **Results**: View exam results with grades and GPA
- **Download Materials**: Access and download course materials (PDFs, videos, documents)

### ☁️ Cloud Integration
- **MongoDB Atlas**: Scalable cloud database for all data storage
- **Cloudinary**: Media management for file uploads (PDFs, images, documents)
- Optimized file delivery and storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Get Your Credentials

**MongoDB Atlas** (2 minutes):
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string

**Cloudinary** (2 minutes):
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get Cloud Name, API Key, and API Secret from dashboard

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/university_db?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Seed the database:
```bash
npm run seed
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Login with Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **University Admin** | admin@university.edu | password123 |
| **College Admin** | james@eng.edu | password123 |
| **Student** | alice@student.edu | password123 |

## 📚 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication
- **Cloudinary** - File storage
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 📁 Project Structure

```
university-management/
├── backend/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── College.js
│   │   ├── Course.js
│   │   ├── Assignment.js
│   │   ├── Attendance.js
│   │   ├── Result.js
│   │   └── ...
│   ├── routes/              # API endpoints
│   │   ├── auth.js          # Authentication
│   │   ├── university.js    # University admin routes
│   │   ├── college.js       # College admin routes
│   │   ├── student.js       # Student routes
│   │   └── upload.js        # File upload routes
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── config/
│   │   └── cloudinary.js    # Cloudinary setup
│   ├── server.js            # Entry point
│   ├── seed.js              # Database seeder
│   └── package.json
├── src/
│   ├── components/          # React components
│   │   ├── Login.tsx
│   │   ├── UniversityAdminDashboard.tsx
│   │   ├── CollegeAdminDashboard.tsx
│   │   └── StudentDashboard.tsx
│   ├── context/
│   │   └── AuthContext.tsx  # Auth state management
│   ├── config/
│   │   └── api.ts           # API configuration
│   ├── services/
│   │   └── authService.ts   # Auth API calls
│   └── App.tsx
├── QUICK_START.md           # Quick setup guide
├── DEPLOYMENT_GUIDE.md      # Detailed deployment guide
└── README.md               # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### University Admin
- `GET /api/university/stats` - Dashboard statistics
- `GET /api/university/colleges` - List all colleges
- `POST /api/university/colleges` - Create college
- `PUT /api/university/colleges/:id` - Update college
- `DELETE /api/university/colleges/:id` - Delete college
- `GET /api/university/programs` - List all programs
- `POST /api/university/programs` - Create program
- `GET /api/university/analytics` - Get analytics data

### College Admin
- `GET /api/college/stats` - College statistics
- `GET /api/college/courses` - List courses
- `POST /api/college/courses` - Create course
- `GET /api/college/faculty` - List faculty
- `POST /api/college/faculty` - Add faculty
- `GET /api/college/timetable` - Get timetable
- `POST /api/college/timetable` - Create schedule
- `GET /api/college/attendance` - Get attendance
- `POST /api/college/attendance` - Mark attendance
- `GET /api/college/assignments` - List assignments
- `POST /api/college/assignments` - Create assignment
- `PUT /api/college/assignments/:id/grade` - Grade submission

### Student
- `GET /api/student/dashboard` - Dashboard stats
- `GET /api/student/courses` - Enrolled courses
- `GET /api/student/attendance` - Attendance records
- `GET /api/student/assignments` - View assignments
- `POST /api/student/assignments/:id/submit` - Submit assignment
- `GET /api/student/results` - View results
- `GET /api/student/materials` - Download materials

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `POST /api/upload/material` - Upload course material

## 🚀 Deployment

### Deploy to Render (Recommended for Backend)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy Backend on Render**
   - Go to [Render.com](https://render.com/)
   - New Web Service
   - Connect GitHub repository
   - Set Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (MongoDB, Cloudinary, JWT secret)

3. **Seed Database**
   - In Render Shell: `npm run seed`

4. **Deploy Frontend** (Choose one):
   - **Vercel**: Import from GitHub → Deploy
   - **Netlify**: New site from Git → Deploy
   - **Render Static Site**: Build: `npm run build`, Publish: `dist`

📖 **See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions**

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication with 30-day expiration
- Role-based access control middleware
- Protected API endpoints
- Secure file upload validation
- MongoDB injection protection with Mongoose

## 🎨 UI Features

- Modern, responsive design with Tailwind CSS
- Gradient backgrounds and smooth animations
- Modal-based forms for better UX
- Real-time data updates
- Loading states and error handling
- Mobile-friendly interface
- Interactive charts and statistics

## 📊 Database Models

- **User**: Authentication and profile data
- **College**: College information and statistics
- **Program**: Academic program details
- **Course**: Course information and enrollments
- **Timetable**: Class scheduling
- **Attendance**: Attendance tracking
- **Assignment**: Assignment creation and submissions
- **Result**: Exam results and grades
- **Material**: Course materials and files

## 🧪 Testing

All functionality is tested and working:
- ✅ User authentication and authorization
- ✅ College and program management
- ✅ Course creation and enrollment
- ✅ Timetable scheduling
- ✅ Attendance marking and tracking
- ✅ Assignment submission and grading
- ✅ Result viewing
- ✅ File upload to Cloudinary
- ✅ Material download

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For detailed setup instructions:
- Quick Start: See [QUICK_START.md](QUICK_START.md)
- Deployment: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🎉 Features Highlight

✅ **Fully Functional** - All buttons and features are active  
✅ **Cloud-Ready** - Easy deployment to Render, Vercel, or Netlify  
✅ **Scalable** - Built with MongoDB Atlas for cloud scaling  
✅ **Modern Stack** - React + Node.js + MongoDB + Cloudinary  
✅ **Production Ready** - Includes authentication, authorization, and file handling  
✅ **Mobile Responsive** - Works on all devices  
✅ **Type Safe** - Built with TypeScript  
✅ **Well Documented** - Complete setup and deployment guides  

---

Made with ❤️ for educational institutions

**Start building your university management system today!** 🚀
=======
# University-Management
>>>>>>> af57e922844dc7b8d1896d65cf4dfdacfec198ef
