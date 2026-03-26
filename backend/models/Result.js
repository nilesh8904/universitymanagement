const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  examType: {
    type: String,
    enum: ['Mid-Term', 'End-Term', 'Final', 'Quiz', 'Assignment', 'Lab'],
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 0,
  },
  obtainedMarks: {
    type: Number,
    required: true,
    min: 0,
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    required: true,
  },
  gpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
}, {
  timestamps: true,
});

// Index for better query performance
resultSchema.index({ student: 1, course: 1 });
resultSchema.index({ student: 1, semester: 1 });
resultSchema.index({ course: 1 });
resultSchema.index({ college: 1 });
resultSchema.index({ examType: 1 });

// Compound index to prevent duplicate results
resultSchema.index({ student: 1, course: 1, examType: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);