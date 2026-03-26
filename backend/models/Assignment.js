const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
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
  dueDate: {
    type: Date,
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 1,
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    files: [{
      filename: String,
      url: String,
      size: Number,
    }],
    marks: {
      type: Number,
      min: 0,
    },
    feedback: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted',
    },
  }],
}, {
  timestamps: true,
});

// Index for better query performance
assignmentSchema.index({ course: 1 });
assignmentSchema.index({ faculty: 1 });
assignmentSchema.index({ college: 1 });
assignmentSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);