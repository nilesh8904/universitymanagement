const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['university_admin', 'college_admin', 'student'],
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  facultyInfo: {
    employeeId: {
      type: String,
      sparse: true,
    },
    department: String,
    specialization: String,
    phone: String,
  },
  studentInfo: {
    rollNumber: {
      type: String,
      sparse: true,
    },
    department: String,
    semester: Number,
    year: Number,
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
}, {
  timestamps: true,
});

// Compare password helper - plain text comparison (synchronous)
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!candidatePassword || typeof candidatePassword !== 'string') {
    console.log('❌ Invalid candidate password type');
    return false;
  }

  const storedPassword = this.password ? this.password.toString().trim() : '';
  const trimmedCandidate = candidatePassword.toString().trim();

  console.log(`🔍 Comparing: stored="${storedPassword}" vs candidate="${trimmedCandidate}"`);
  
  if (!storedPassword) {
    console.log('❌ No stored password found');
    return false;
  }

  const result = trimmedCandidate === storedPassword;
  console.log(`${result ? '✅' : '❌'} Password match: ${result}`);
  return result;
};

// Indexes (email: 1 removed - automatically indexed by unique: true)
userSchema.index({ role: 1 });
userSchema.index({ collegeId: 1 });

module.exports = mongoose.model('User', userSchema);