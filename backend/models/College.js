const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
    trim: true,
  },
  dean: {
    type: String,
    required: true,
    trim: true,
  },
  establishedYear: {
    type: Number,
    required: true,
  },
  studentCount: {
    type: Number,
    default: 0,
  },
  facultyCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for better query performance
collegeSchema.index({ code: 1 });
collegeSchema.index({ name: 1 });

module.exports = mongoose.model('College', collegeSchema);