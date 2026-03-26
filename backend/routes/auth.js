const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const College = require('../models/College');
const { protect } = require('../middleware/auth');

const normalizeCollegeId = async (rawCollegeId) => {
  if (!rawCollegeId) return null;

  if (mongoose.Types.ObjectId.isValid(rawCollegeId)) {
    const byId = await College.findById(rawCollegeId);
    if (byId) return byId._id;
  }

  const normalized = rawCollegeId.toString().trim().toUpperCase();
  const byCode = await College.findOne({ code: normalized });
  if (byCode) return byCode._id;

  return null;
};

// ================= GENERATE TOKEN =================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
      collegeId,
      studentInfo,
      facultyInfo
    } = req.body;

    // 🔍 Validation
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    email = email.toLowerCase().trim();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }
    // 🔍 Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Normalize/validate collegeId if provided
    if (collegeId) {
      const resolvedCollegeId = await normalizeCollegeId(collegeId);
      if (!resolvedCollegeId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid collegeId. Use a valid ObjectId or college code.',
        });
      }
      collegeId = resolvedCollegeId;
    }

    // ✅ Create user (password auto hashed via model)
    const user = await User.create({
      name,
      email,
      password,
      role,
      collegeId,
      studentInfo,
      facultyInfo,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });

  } catch (error) {
    console.error('❌ Register error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🔍 Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    email = email.toLowerCase().trim();

    console.log(`📌 Login attempt: ${email}`);

    // 🔍 Find user
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare password using model helper (now synchronous)
    const isPasswordValid = user.comparePassword(password);

    if (!isPasswordValid) {
      console.log('❌ Wrong password for user:', user.email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log('✅ Login successful');

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
        studentInfo: user.studentInfo,
        facultyInfo: user.facultyInfo,
        token,
      },
    });

  } catch (error) {
    console.error('❌ Login error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
});


// ================= GET CURRENT USER =================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('collegeId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error('❌ Get user error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= CHANGE PASSWORD =================
router.put('/change-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'oldPassword and newPassword are required',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must not be the same as old password',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('❌ Change password error:', error.message);

    res.status(500).json({
      success: false,
      message: error.message || 'Could not change password',
    });
  }
});

// ================= DEBUG ENDPOINT (Development Only) =================
// Remove this in production!
router.post('/debug/test-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found in database',
        debug: {
          email_searched: email.toLowerCase().trim(),
        }
      });
    }

    const isMatch = user.comparePassword(password);

    res.json({
      success: true,
      message: 'Debug information',
      debug: {
        email: user.email,
        name: user.name,
        role: user.role,
        hash_stored: user.password.substring(0, 20) + '...',
        hash_length: user.password.length,
        password_match: isMatch,
        test_password: password,
      }
    });

  } catch (error) {
    console.error('❌ Debug error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= DEBUG: FULL LOGIN SIMULATION =================
// Test exact login flow with detailed diagnostics
router.post('/debug/login-test', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('\n=== FULL LOGIN TEST ===');
    console.log(`1️⃣ Raw input email: "${email}"`);
    console.log(`1️⃣ Raw input password: "${password}"`);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    const processedEmail = email.toLowerCase().trim();
    console.log(`2️⃣ Processed email: "${processedEmail}"`);
    console.log(`2️⃣ Processed email length: ${processedEmail.length}`);
    console.log(`2️⃣ Processed email charCodes: ${Array.from(processedEmail).map(c => c.charCodeAt(0)).join(',')}`);

    // Find user
    const user = await User.findOne({ email: processedEmail });
    console.log(`3️⃣ User found: ${user ? 'YES' : 'NO'}`);

    if (!user) {
      console.log(`4️⃣ No user with email: ${processedEmail}`);
      
      // Show all emails in DB for debugging
      const allEmails = await User.find({}).select('email').lean();
      console.log(`📧 All emails in DB: ${allEmails.map(u => u.email).join(', ')}`);
      
      return res.json({
        success: false,
        message: 'User not found',
        debug: {
          searchedEmail: processedEmail,
          allUsersInDB: allEmails.map(u => u.email),
        }
      });
    }

    console.log(`4️⃣ User found: ${user.name} (${user.email})`);
    console.log(`5️⃣ Stored password: "${user.password}"`);
    console.log(`5️⃣ Stored password length: ${user.password.length}`);
    console.log(`5️⃣ Stored password charCodes: ${Array.from(user.password).map(c => c.charCodeAt(0)).join(',')}`);

    // Test comparison
    console.log(`6️⃣ Attempting password comparison...`);
    const isMatch = user.comparePassword(password);
    
    console.log(`7️⃣ Comparison result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);

    if (!isMatch) {
      const storedTrimmed = user.password.toString().trim();
      const candidateTrimmed = password.toString().trim();
      
      console.log(`\n🔍 Deep comparison:`);
      console.log(`   Stored (trimmed): "${storedTrimmed}"`);
      console.log(`   Candidate (trimmed): "${candidateTrimmed}"`);
      console.log(`   Stored length: ${storedTrimmed.length}, Candidate length: ${candidateTrimmed.length}`);
      console.log(`   Stored === Candidate: ${storedTrimmed === candidateTrimmed}`);
      console.log(`   Stored == Candidate: ${storedTrimmed == candidateTrimmed}`);
      
      // Character-by-character comparison
      const maxLen = Math.max(storedTrimmed.length, candidateTrimmed.length);
      let diffFound = false;
      for (let i = 0; i < maxLen; i++) {
        if (storedTrimmed[i] !== candidateTrimmed[i]) {
          console.log(`   Difference at position ${i}: stored='${storedTrimmed[i]}' (${storedTrimmed.charCodeAt(i)}), candidate='${candidateTrimmed[i]}' (${candidateTrimmed.charCodeAt(i)})`);
          diffFound = true;
        }
      }
      if (!diffFound && storedTrimmed.length !== candidateTrimmed.length) {
        console.log(`   Length mismatch: stored=${storedTrimmed.length}, candidate=${candidateTrimmed.length}`);
      }
    }

    res.json({
      success: true,
      debug: {
        email_processed: processedEmail,
        user_found: !!user,
        user_name: user ? user.name : null,
        user_role: user ? user.role : null,
        password_match: isMatch,
        stored_password: user ? user.password : null,
        input_password: password,
        stored_length: user ? user.password.length : null,
        input_length: password.length,
      }
    });

  } catch (error) {
    console.error('❌ Debug error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= DEBUG: LIST ALL USERS WITH PASSWORDS =================
// Development only - shows all users and their plain text passwords in MongoDB
router.get('/debug/all-users', async (req, res) => {
  try {
    const allUsers = await User.find({}).lean();

    const userList = allUsers.map(user => ({
      email: user.email,
      name: user.name,
      role: user.role,
      password: user.password,
      passwordLength: user.password ? user.password.length : 0,
      isPlainText: user.password === 'password123',
      isHashed: user.password && user.password.startsWith('$2'),
    }));

    res.json({
      success: true,
      totalUsers: allUsers.length,
      users: userList,
      summary: {
        plainTextUsers: userList.filter(u => u.isPlainText).length,
        hashedUsers: userList.filter(u => u.isHashed).length,
        otherUsers: userList.filter(u => !u.isPlainText && !u.isHashed).length,
      }
    });

  } catch (error) {
    console.error('❌ Debug error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;