require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dns = require("dns");

console.log('🚀 Starting server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');

// Configure DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// ================= MIDDLEWARE =================
const cors = require('cors');

app.use(cors({
  origin: function (origin, callback) {
    // allow requests without origin (Postman etc.)
    if (!origin) return callback(null, true);

    // allow all localhost origins (any port)
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    // allow vercel domains
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    // allow render domains
    if (origin.includes("render.com") || origin.includes("onrender.com")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= MONGODB CONNECTION =================
let mongoConnected = false;

const connectMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    });

    mongoConnected = true;
    console.log('✅ MongoDB Connected');

  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⏳ Retrying in 10 seconds...');
    mongoConnected = false;
    setTimeout(connectMongoDB, 10000);
  }
};

connectMongoDB();

// ================= API ROUTES =================
try {
  app.use('/auth', require('./backend/routes/auth'));
  app.use('/university', require('./backend/routes/university'));
  app.use('/college', require('./backend/routes/college'));
  app.use('/student', require('./backend/routes/student'));
  app.use('/upload', require('./backend/routes/upload'));
  console.log('✅ All routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

// ================= HEALTH CHECK =================
app.get('/health', (req, res) => {
  res.json({ 
    status: mongoConnected ? 'OK' : 'NO_DB',
    message: mongoConnected 
      ? 'Server running with MongoDB ✅' 
      : 'Server running but MongoDB not connected ❌'
  });
});

// ================= SERVE FRONTEND STATIC FILES =================
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// ================= SPA FALLBACK =================
// For any route not matched by API routes, serve index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
