# ⚡ QUICK START - 3 Minutes to Running System

## 🎯 Get Your System Running NOW

### Terminal 1 - Backend (Stay running)
```bash
cd backend
npm install
npm run seed
npm run dev
```

**Wait for:** 
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

### Terminal 2 - Frontend (New Terminal, ctrl + `)
```bash
npm install
npm run dev
```

**Wait for:**
```
✅ VITE v7.2.4 ready
✅ Local: http://localhost:5173/
```

---

## 🔐 Quick Login

### Open http://localhost:5173 in browser

**Choose one to test:**

| Role | Email | Password |
|------|-------|----------|
| Manage Everything | `admin@university.edu` | `password123` |
| Manage College | `james@eng.edu` | `password123` |
| View Courses | `alice@student.edu` | `password123` |

---

## ✅ What's Working

✓ Login & Logout  
✓ All Buttons Active  
✓ All Forms Working  
✓ Database Connected  
✓ All 3 Dashboards Ready  

---

## 🐛 Issues?

| Problem | Solution |
|---------|----------|
| Won't Start | Check Node.js v18+ installed: `node -v` |
| MongoDB Error | Check .env file has MONGODB_URI |
| Port 5000 in Use | Kill process: `netstat -ano \| findstr :5000` |
| CORS Error | Make sure backend is running |
| Login Fails | Run `npm run seed` to create test users |

---

## 📱 Test a Button Right Away

1. Login as university admin
2. Click "Colleges" tab
3. Click "Add College" button
4. Fill form and submit
5. See new college appear ✓

---

## 💡 Pro Tips

- Button not working? Check browser console: Press `F12`
- Check API working: `curl http://localhost:5000/health`
- Started fresh? Run `npm run seed` to get test data
- Frontend reload not working? Hard refresh: `Ctrl + Shift + R`

---

**You're Ready! All systems operational.** 🚀
