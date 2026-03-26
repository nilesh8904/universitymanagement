# University Management System - Backend

Complete backend API for University Management System with MongoDB Atlas and Cloudinary integration.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/university_db?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Paste it in `.env` as `MONGODB_URI`

### 4. Get Cloudinary Credentials

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
4. Paste them in `.env`

### 5. Seed the Database

```bash
npm run seed
```

This will create:
- Demo colleges
- Demo users (admin, faculty, students)
- Sample courses
- Attendance records
- Assignments and results

### 6. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📧 Demo Login Credentials

After seeding, use these credentials:

**University Admin:**
- Email: `admin@university.edu`
- Password: `password123`

**College Admin (Faculty):**
- Email: `james@eng.edu`
- Password: `password123`

**Student:**
- Email: `alice@student.edu`
- Password: `password123`

## 🌐 Deploy to Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: university-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

5. Add Environment Variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Your JWT secret key
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

6. Click "Create Web Service"

7. After deployment, copy your Render URL (e.g., `https://university-backend.onrender.com`)

### Step 3: Update Frontend

Update the frontend API URL in `src/config/api.ts`:
```typescript
const API_URL = 'https://your-backend-url.onrender.com/api';
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### University Admin
- `GET /api/university/stats` - Get statistics
- `GET /api/university/colleges` - Get all colleges
- `POST /api/university/colleges` - Create college
- `PUT /api/university/colleges/:id` - Update college
- `DELETE /api/university/colleges/:id` - Delete college
- `GET /api/university/programs` - Get all programs
- `POST /api/university/programs` - Create program
- `GET /api/university/analytics` - Get analytics data

### College Admin
- `GET /api/college/stats` - Get college statistics
- `GET /api/college/courses` - Get courses
- `POST /api/college/courses` - Create course
- `GET /api/college/faculty` - Get faculty
- `POST /api/college/faculty` - Add faculty
- `GET /api/college/timetable` - Get timetable
- `POST /api/college/timetable` - Create timetable
- `GET /api/college/attendance` - Get attendance
- `POST /api/college/attendance` - Mark attendance
- `GET /api/college/assignments` - Get assignments
- `POST /api/college/assignments` - Create assignment
- `PUT /api/college/assignments/:id/grade` - Grade assignment

### Student
- `GET /api/student/dashboard` - Get dashboard stats
- `GET /api/student/courses` - Get enrolled courses
- `GET /api/student/attendance` - Get attendance records
- `GET /api/student/assignments` - Get assignments
- `POST /api/student/assignments/:id/submit` - Submit assignment
- `GET /api/student/results` - Get results
- `GET /api/student/materials` - Get course materials

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `POST /api/upload/material` - Upload course material
- `GET /api/upload/materials/:courseId` - Get course materials

## 🔒 Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📦 Tech Stack

- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Cloudinary** - File storage
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 🛠️ Models

- **User** - University admin, college admin, students
- **College** - College information
- **Program** - Academic programs
- **Course** - Course details
- **Timetable** - Class schedules
- **Attendance** - Attendance records
- **Assignment** - Assignment management
- **Result** - Student results
- **Material** - Course materials

## 📝 Notes

- The backend automatically hashes passwords before saving
- JWT tokens expire in 30 days
- Cloudinary supports PDF, images, documents, presentations
- All dates are stored in UTC format
- The seed script clears existing data before inserting new data

## 🆘 Troubleshooting

**MongoDB Connection Error:**
- Check if your IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure password doesn't contain special characters

**Cloudinary Upload Error:**
- Verify API credentials are correct
- Check file size limits
- Ensure allowed file formats

**CORS Error:**
- Update `FRONTEND_URL` in `.env`
- Check frontend API configuration

## 📞 Support

For issues or questions, check:
- MongoDB Atlas documentation
- Cloudinary documentation
- Express.js documentation
