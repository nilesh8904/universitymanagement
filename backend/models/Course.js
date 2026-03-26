const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Index for better query performance (code: 1 removed - automatically indexed by unique: true)
courseSchema.index({ college: 1 });
courseSchema.index({ faculty: 1 });
courseSchema.index({ semester: 1 });

module.exports = mongoose.model('Course', courseSchema);