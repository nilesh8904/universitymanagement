# ⚡ Quick Start Guide

## 🎯 What You Need (Just 2 Things!)

1. **MongoDB Atlas URL** - Free database (5 minutes to setup)
2. **Cloudinary Credentials** - Free file storage (3 minutes to setup)

---

## 📋 Step-by-Step Setup

### 1️⃣ Get MongoDB Atlas Connection String (5 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** → Create account
3. Click **"Build a Database"** → Select **"FREE"** (M0)
4. Click **"Create"**
5. Create username: `admin` and password: `password123` (or your choice)
6. Click **"Create User"**
7. Scroll down → **"Add My Current IP Address"** → Click **"Finish and Close"**
8. Click **"Connect"** → **"Connect your application"**
9. **Copy the connection string**:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
10. Replace `<password>` with your actual password and add `/university_db`:
    ```
    mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/university_db?retryWrites=true&w=majority
    ```

✅ **Done! Save this string!**

---

### 2️⃣ Get Cloudinary Credentials (3 min)

1. Go to https://cloudinary.com
2. Click **"Sign Up Free"**
3. Fill in details → Verify email
4. Go to **Dashboard**
5. Copy these 3 things:
   - **Cloud Name**: (e.g., `dxxxxx`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: Click eye icon to reveal (e.g., `ABCdef123...`)

✅ **Done! Save these 3 values!**

---

### 3️⃣ Setup Backend (2 min)

1. Open `backend/.env` file
2. Paste your credentials:

```env
# Paste your MongoDB connection string here
MONGODB_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/university_db?retryWrites=true&w=majority

# Any random text (leave as is or change)
JWT_SECRET=mysupersecretkey123

# Paste your Cloudinary credentials here
CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=ABCdef123...

PORT=5000
FRONTEND_URL=http://localhost:5173
```

3. Save the file

---

### 4️⃣ Install & Run (1 min)

Open **TWO** terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run seed    # This creates demo data
npm run dev     # Start backend server
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev     # Start frontend
```

✅ **Done! Open http://localhost:5173**

---

## 🔐 Demo Login Credentials

After running `npm run seed`, use these to login:

| Role | Email | Password |
|------|-------|----------|
| **University Admin** | admin@university.edu | password123 |
| **College Admin** | james@eng.edu | password123 |
| **Student** | alice@student.edu | password123 |

---

## 🚀 Deploy to Render (10 min)

### Backend Deployment:

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. Go to https://render.com → Sign up
3. Click **"New +"** → **"Web Service"**
4. Connect GitHub → Select your repository
5. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click **"Advanced"** → Add environment variables:
   - `MONGODB_URI` = Your MongoDB string
   - `JWT_SECRET` = mysupersecretkey123
   - `CLOUDINARY_CLOUD_NAME` = Your cloud name
   - `CLOUDINARY_API_KEY` = Your API key
   - `CLOUDINARY_API_SECRET` = Your API secret
7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. **Copy your backend URL**: `https://your-app.onrender.com`

### Seed Database on Render:

1. In Render → Your service → **"Shell"** tab
2. Run: `npm run seed`
3. Wait for completion

### Update Frontend:

1. Open `src/config/api.ts`
2. Change:
   ```typescript
   export const API_URL = 'https://your-app.onrender.com/api';
   ```
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update API URL"
   git push
   ```

### Deploy Frontend (Choose one):

**Option A: Vercel** (Recommended)
1. Go to https://vercel.com
2. Import GitHub repository
3. Click Deploy

**Option B: Netlify**
1. Go to https://netlify.com
2. New site from Git
3. Select repository → Deploy

---

## ✅ Verify Everything Works

1. **Backend Health Check**:
   ```
   https://your-backend.onrender.com/health
   ```
   Should show: `{"status":"OK"}`

2. **Frontend**: 
   - Open your deployed frontend URL
   - Login with demo credentials
   - Test creating a course, marking attendance, uploading files

---

## 🎉 That's It!

You now have a fully functional University Management System with:
- ✅ Cloud database (MongoDB Atlas)
- ✅ File storage (Cloudinary)
- ✅ Deployed backend (Render)
- ✅ Deployed frontend (Vercel/Netlify)

**Total Time**: ~20 minutes

---

## 🆘 Problems?

**"MongoDB connection failed"**
- Go to MongoDB Atlas → Network Access → Add IP `0.0.0.0/0`

**"Cloudinary upload not working"**
- Double-check credentials in .env
- Make sure no extra spaces

**"Backend won't start"**
- Check all environment variables are set
- View logs in Render dashboard

**Need help?**
- Read full deployment guide: `DEPLOYMENT_GUIDE.md`
- Check MongoDB Atlas docs
- Check Cloudinary docs

---

## 📁 Project Structure

```
university-management/
├── backend/                 # Node.js + Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth middleware
│   ├── config/             # Cloudinary config
│   ├── .env               # ← PUT YOUR CREDENTIALS HERE
│   ├── server.js          # Entry point
│   └── seed.js            # Demo data
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── config/            # API configuration
│   └── services/          # API services
└── DEPLOYMENT_GUIDE.md    # Detailed deployment guide
```

Happy coding! 🚀
