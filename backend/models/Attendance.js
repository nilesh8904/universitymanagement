const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ college: 1 });
attendanceSchema.index({ markedBy: 1 });

// Compound index to prevent duplicate attendance records
attendanceSchema.index({ course: 1, student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);