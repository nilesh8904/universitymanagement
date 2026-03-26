# 🚀 Complete Deployment Guide - University Management System

## Prerequisites

Before you start, make sure you have:
- A GitHub account
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier)
- A [Cloudinary](https://cloudinary.com/) account (free tier)
- A [Render](https://render.com/) account (free tier)

---

## Part 1: Setup MongoDB Atlas (Database)

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"** or **"Log In"**
3. Click **"Build a Database"**
4. Select **"FREE"** tier (M0 Sandbox)
5. Choose a cloud provider (AWS recommended)
6. Select a region closest to you
7. Click **"Create Cluster"**

### Step 2: Create Database User

1. On the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username: `university_admin`
5. Click **"Autogenerate Secure Password"** and **SAVE THIS PASSWORD**
6. Select **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Whitelist IP Addresses

1. On the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access From Anywhere"** (for development)
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go back to **"Database"**
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://university_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace** `<password>` with your actual password from Step 2
6. **Add database name** before the `?`:
   ```
   mongodb+srv://university_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/university_db?retryWrites=true&w=majority
   ```
7. **SAVE THIS CONNECTION STRING** - you'll need it later

---

## Part 2: Setup Cloudinary (File Storage)

### Step 1: Create Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click **"Sign Up Free"**
3. Fill in your details and verify email

### Step 2: Get Credentials

1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. You'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "eye" icon to reveal)
3. **SAVE THESE THREE VALUES** - you'll need them later

---

## Part 3: Deploy Backend to Render

### Step 1: Push Code to GitHub

1. Open terminal in your project root
2. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit with backend"
   ```

3. Create a new repository on GitHub (don't initialize with README)

4. Push to GitHub:
   ```bash
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and authorize Render
4. Select your repository

5. Configure the service:
   - **Name**: `university-backend` (or any name you like)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

6. Scroll down to **"Advanced"** → **"Add Environment Variables"**

7. Add these environment variables:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB connection string from Part 1 |
   | `JWT_SECRET` | Any random string (e.g., `mySecretKey123!@#`) |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Your Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
   | `FRONTEND_URL` | `*` (allow all origins for now) |

8. Click **"Create Web Service"**

9. Wait for deployment (5-10 minutes)

10. Once deployed, **COPY YOUR BACKEND URL**:
    ```
    https://university-backend-xxxx.onrender.com
    ```

### Step 3: Seed the Database

1. In Render, go to your service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npm run seed
   ```
4. Wait for the seed script to complete
5. You should see demo login credentials

---

## Part 4: Update Frontend for Production

### Step 1: Update API URL

1. Open `src/config/api.ts`
2. Replace the API_URL with your Render backend URL:
   ```typescript
   export const API_URL = 'https://university-backend-xxxx.onrender.com/api';
   ```

### Step 2: Commit Changes

```bash
git add .
git commit -m "Update API URL for production"
git push
```

---

## Part 5: Deploy Frontend (Optional - Render Static Site)

### Option A: Deploy Frontend to Render

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Select your GitHub repository
3. Configure:
   - **Name**: `university-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Click **"Create Static Site"**
5. Your frontend will be available at:
   ```
   https://university-frontend-xxxx.onrender.com
   ```

### Option B: Deploy Frontend to Vercel (Recommended)

1. Go to [Vercel](https://vercel.com/)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**

### Option C: Deploy Frontend to Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**

---

## Part 6: Testing Your Deployment

### Step 1: Test Backend API

Open in browser:
```
https://your-backend-url.onrender.com/health
```

You should see:
```json
{"status":"OK","message":"Server is running"}
```

### Step 2: Test Frontend Login

Use these credentials (from the seed script):

**University Admin:**
- Email: `admin@university.edu`
- Password: `password123`

**College Admin:**
- Email: `james@eng.edu`
- Password: `password123`

**Student:**
- Email: `alice@student.edu`
- Password: `password123`

### Step 3: Test File Upload

1. Login as College Admin
2. Go to "Assignments" tab
3. Click "Create Assignment"
4. Try uploading a file
5. Check if file appears in Cloudinary dashboard

---

## 🔧 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Check MongoDB connection string is correct
- Verify password doesn't have special characters (or URL encode it)
- Make sure IP whitelist includes `0.0.0.0/0` in MongoDB Atlas

**"Cloudinary upload failed"**
- Double-check Cloudinary credentials
- Verify cloud name, API key, and API secret are correct

**"Application failed to respond"**
- Check Render logs in the "Logs" tab
- Verify all environment variables are set
- Make sure build and start commands are correct

### Frontend Issues

**"Network Error" or "Failed to fetch"**
- Verify API_URL in `src/config/api.ts` is correct
- Make sure backend is running and accessible
- Check CORS settings in backend

**"401 Unauthorized"**
- Clear browser local storage
- Try logging in again
- Check JWT_SECRET is set in backend

---

## 📝 Environment Variables Reference

### Backend (.env in Render)

```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/university_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
PORT=5000
FRONTEND_URL=*
```

---

## 🎯 Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] MongoDB connection string saved
- [ ] Cloudinary account created
- [ ] Cloudinary credentials saved
- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Environment variables set in Render
- [ ] Database seeded with demo data
- [ ] Backend API tested (/health endpoint)
- [ ] Frontend API_URL updated
- [ ] Frontend deployed
- [ ] Login tested with demo accounts
- [ ] File upload tested

---

## 🚀 Quick Start Summary

1. **MongoDB Atlas**: Create cluster → Get connection string
2. **Cloudinary**: Create account → Get credentials
3. **GitHub**: Push code to repository
4. **Render**: Deploy backend → Add environment variables → Seed database
5. **Frontend**: Update API_URL → Deploy to Vercel/Netlify
6. **Test**: Login and verify all features work

---

## 📞 Support Links

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🎉 You're Done!

Your University Management System is now deployed and ready to use!

**Backend URL**: `https://university-backend-xxxx.onrender.com`
**Frontend URL**: `https://university-frontend-xxxx.onrender.com`

Happy coding! 🎓
