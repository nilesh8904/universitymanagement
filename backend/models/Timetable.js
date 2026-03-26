const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
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
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Start time must be in HH:MM format',
    },
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'End time must be in HH:MM format',
    },
  },
  room: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
}, {
  timestamps: true,
});

// Index for better query performance
timetableSchema.index({ course: 1 });
timetableSchema.index({ faculty: 1 });
timetableSchema.index({ college: 1 });
timetableSchema.index({ day: 1 });
timetableSchema.index({ semester: 1 });
// Index for querying by day and time (without unique constraint to allow multiple courses)
timetableSchema.index({ day: 1, startTime: 1, endTime: 1, room: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);