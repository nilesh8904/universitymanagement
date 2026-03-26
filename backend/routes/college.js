const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Material = require('../models/Material');

// All routes are protected and only for college admins
router.use(protect);
router.use(authorize('college_admin', 'university_admin'));

// @route   GET /api/college/stats
// @desc    Get college statistics
// @access  Private (College Admin)
router.get('/stats', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const totalCourses = await Course.countDocuments({ college: collegeId });
    const totalFaculty = await User.countDocuments({
      role: 'college_admin',
      collegeId: collegeId,
    });
    const totalStudents = await User.countDocuments({
      role: 'student',
      collegeId: collegeId,
    });
    const totalAssignments = await Assignment.countDocuments({ college: collegeId });

    res.json({
      success: true,
      data: {
        totalCourses,
        totalFaculty,
        totalStudents,
        totalAssignments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// COURSES
// @route   GET /api/college/courses
// @desc    Get all courses for a college
// @access  Private (College Admin)
router.get('/courses', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const courses = await Course.find({ college: collegeId })
      .populate('faculty', 'name email facultyInfo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/college/courses
// @desc    Create a new course
// @access  Private (College Admin)
router.post('/courses', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const courseData = { ...req.body, college: collegeId };

    const course = await Course.create(courseData);
    await course.populate('faculty', 'name email facultyInfo');

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/college/courses/:id
// @desc    Update a course
// @access  Private (College Admin)
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('faculty', 'name email facultyInfo');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/college/courses/:id
// @desc    Delete a course
// @access  Private (College Admin)
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// MATERIALS
// @route   GET /api/college/materials
// @desc    Get all materials for the college
// @access  Private (College Admin)
router.get('/materials', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const materials = await Material.find({ college: collegeId })
      .populate('course', 'name code')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/college/materials
// @desc    Add new material by Cloudinary link or file
// @access  Private (College Admin)
router.post('/materials', async (req, res) => {
  try {
    const { title, description, courseId, url, type } = req.body;

    if (!title || !courseId || !url) {
      return res.status(400).json({
        success: false,
        message: 'title, courseId, url are required',
      });
    }

    // Validate courseId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid courseId: "${courseId}". Must be a valid MongoDB ObjectId.`,
      });
    }

    const material = await Material.create({
      title,
      description,
      course: courseId,
      college: req.user.collegeId,
      uploadedBy: req.user._id,
      type: type || 'video',
      url,
      uploadedAt: new Date(),
    });

    await material.populate('course', 'name code');
    await material.populate('uploadedBy', 'name email');

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// FACULTY
// @route   GET /api/college/faculty
// @desc    Get all faculty for a college
// @access  Private (College Admin)
router.get('/faculty', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const faculty = await User.find({
      collegeId: collegeId,
      role: { $in: ['college_admin'] },
    }).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/college/faculty
// @desc    Add a new faculty member
// @access  Private (College Admin)
router.post('/faculty', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const { name, email, facultyInfo } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'name and email are required',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const faculty = await User.create({
      name,
      email,
      password: 'password123',
      role: 'college_admin',
      collegeId,
      facultyInfo,
    });

    res.status(201).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/college/students
// @desc    Get students for college
// @access  Private (College Admin, University Admin)
router.get('/students', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const students = await User.find({ role: 'student', collegeId }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/college/students
// @desc    Add a new student to the college
// @access  Private (College Admin, University Admin)
router.post('/students', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const { name, email, studentInfo } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'name and email are required',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const student = await User.create({
      name,
      email,
      password: 'password123',
      role: 'student',
      collegeId,
      studentInfo,
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TIMETABLE
// @route   GET /api/college/timetable
// @desc    Get timetable for a college
// @access  Private (College Admin)
router.get('/timetable', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const timetable = await Timetable.find({ college: collegeId })
      .populate('course', 'name code')
      .populate('faculty', 'name email')
      .sort({ day: 1, startTime: 1 });

    res.json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/college/timetable
// @desc    Create a new timetable entry
// @access  Private (College Admin)
router.post('/timetable', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const timetableData = { ...req.body, college: collegeId };

    const timetable = await Timetable.create(timetableData);
    await timetable.populate('course', 'name code');
    await timetable.populate('faculty', 'name email');

    res.status(201).json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/college/timetable/:id
// @desc    Delete a timetable entry
// @access  Private (College Admin)
router.delete('/timetable/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found',
      });
    }

    res.json({
      success: true,
      message: 'Timetable entry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ATTENDANCE
// @route   GET /api/college/attendance
// @desc    Get attendance records
// @access  Private (College Admin)
router.get('/attendance', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const { courseId, date } = req.query;

    let query = { college: collegeId };
    if (courseId) query.course = courseId;
    if (date) query.date = new Date(date);

    const attendance = await Attendance.find(query)
      .populate('course', 'name code')
      .populate('student', 'name email studentInfo')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/college/attendance
// @desc    Mark attendance
// @access  Private (College Admin)
router.post('/attendance', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const { course, student, date, status } = req.body;

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      course,
      student,
      date: new Date(date),
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      await existingAttendance.save();
      await existingAttendance.populate('course', 'name code');
      await existingAttendance.populate('student', 'name email studentInfo');

      return res.json({
        success: true,
        data: existingAttendance,
      });
    }

    // Create new attendance
    const attendance = await Attendance.create({
      course,
      student,
      date: new Date(date),
      status,
      markedBy: req.user._id,
      college: collegeId,
    });

    await attendance.populate('course', 'name code');
    await attendance.populate('student', 'name email studentInfo');

    res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ASSIGNMENTS
// @route   GET /api/college/assignments
// @desc    Get all assignments
// @access  Private (College Admin)
router.get('/assignments', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const assignments = await Assignment.find({ college: collegeId })
      .populate('course', 'name code')
      .populate('faculty', 'name email')
      .populate('submissions.student', 'name email studentInfo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/college/assignments
// @desc    Create a new assignment
// @access  Private (College Admin)
router.post('/assignments', async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const assignmentData = {
      ...req.body,
      college: collegeId,
      faculty: req.user._id,
    };

    const assignment = await Assignment.create(assignmentData);
    await assignment.populate('course', 'name code');
    await assignment.populate('faculty', 'name email');

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/college/assignments/:id/grade
// @desc    Grade an assignment submission
// @access  Private (College Admin)
router.put('/assignments/:id/grade', async (req, res) => {
  try {
    const { studentId, marks, feedback, status } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Find the submission
    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Update submission
    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = status || 'graded';

    await assignment.save();
    await assignment.populate('course', 'name code');
    await assignment.populate('faculty', 'name email');
    await assignment.populate('submissions.student', 'name email studentInfo');

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
