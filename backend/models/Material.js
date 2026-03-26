const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
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
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['pdf', 'video', 'link', 'document', 'presentation'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number, // in bytes
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
materialSchema.index({ course: 1 });
materialSchema.index({ uploadedBy: 1 });
materialSchema.index({ college: 1 });
materialSchema.index({ type: 1 });
materialSchema.index({ isActive: 1 });

module.exports = mongoose.model('Material', materialSchema);