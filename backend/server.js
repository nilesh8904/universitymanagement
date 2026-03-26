require('dotenv').config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const mongoose = require('mongoose');


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
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds for server selection
      socketTimeoutMS: 45000, // 45 seconds for socket operations
      retryWrites: true,
      w: 'majority',
    });

    mongoConnected = true;
    console.log('✅ MongoDB Connected');

  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⏳ Retrying in 10 seconds...');
    mongoConnected = false;
    setTimeout(connectMongoDB, 10000); // Retry after 10 seconds
  }
};

connectMongoDB();

// ================= ROUTES =================
app.use('/auth', require('./routes/auth'));
app.use('/university', require('./routes/university'));
app.use('/college', require('./routes/college'));
app.use('/student', require('./routes/student'));
app.use('/upload', require('./routes/upload'));

// ================= HEALTH CHECK =================
app.get('/health', (req, res) => {
  res.json({ 
    status: mongoConnected ? 'OK' : 'NO_DB',
    message: mongoConnected 
      ? 'Server running with MongoDB ✅' 
      : 'Server running but MongoDB not connected ❌'
  });
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
  console.log(`🚀 Server running on port ${PORT}`);
});