const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
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
  degree: {
    type: String,
    required: true,
    enum: ['B.Tech', 'M.Tech', 'BBA', 'MBA', 'B.Sc', 'M.Sc', 'BA', 'MA'],
  },
  duration: {
    type: String,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance (code: 1 removed - automatically indexed by unique: true)
programSchema.index({ college: 1 });
programSchema.index({ department: 1 });

module.exports = mongoose.model('Program', programSchema);