const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, authorize } = require('../middleware/auth');
const College = require('../models/College');
const Program = require('../models/Program');
const User = require('../models/User');

const normalizeCollegeId = async (rawCollegeId) => {
  if (!rawCollegeId) return null;

  if (mongoose.Types.ObjectId.isValid(rawCollegeId)) {
    const byId = await College.findById(rawCollegeId);
    if (byId) return byId._id;
  }

  const normalized = rawCollegeId.toString().trim().toUpperCase();
  const byCode = await College.findOne({ code: normalized });
  if (byCode) return byCode._id;

  return null;
};

// All routes are protected and only for university admins
router.use(protect);
router.use(authorize('university_admin'));

// @route   GET /api/university/stats
// @desc    Get university statistics
// @access  Private (University Admin)
router.get('/stats', async (req, res) => {
  try {
    const totalColleges = await College.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'college_admin' });
    const totalPrograms = await Program.countDocuments();

    res.json({
      success: true,
      data: {
        totalColleges,
        totalStudents,
        totalFaculty,
        totalPrograms,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/university/colleges
// @desc    Get all colleges
// @access  Private (University Admin)
router.get('/colleges', async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/university/colleges
// @desc    Create a new college
// @access  Private (University Admin)
router.post('/colleges', async (req, res) => {
  try {
    const college = await College.create(req.body);

    res.status(201).json({
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/university/colleges/:id
// @desc    Update a college
// @access  Private (University Admin)
router.put('/colleges/:id', async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found',
      });
    }

    res.json({
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/university/colleges/:id
// @desc    Delete a college
// @access  Private (University Admin)
router.delete('/colleges/:id', async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found',
      });
    }

    res.json({
      success: true,
      message: 'College deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/university/college-admins
// @desc    Add a new college admin
// @access  Private (University Admin)
router.post('/college-admins', async (req, res) => {
  try {
    const { name, email, collegeId, facultyInfo } = req.body;

    if (!name || !email || !collegeId) {
      return res.status(400).json({
        success: false,
        message: 'name, email and collegeId are required',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const collegeAdmin = await User.create({
      name,
      email,
      password: 'password123',
      role: 'college_admin',
      collegeId,
      facultyInfo,
    });

    res.status(201).json({
      success: true,
      data: collegeAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/university/programs
// @desc    Get all programs
// @access  Private (University Admin)
router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.find().populate('college').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/university/programs
// @desc    Create a new program
// @access  Private (University Admin)
router.post('/programs', async (req, res) => {
  try {
    const program = await Program.create(req.body);
    await program.populate('college');

    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/university/programs/:id
// @desc    Update a program
// @access  Private (University Admin)
router.put('/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('college');

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }

    res.json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/university/programs/:id
// @desc    Delete a program
// @access  Private (University Admin)
router.delete('/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }

    res.json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/university/analytics
// @desc    Get analytics data
// @access  Private (University Admin)
router.get('/analytics', async (req, res) => {
  try {
    // Get student distribution by college
    const colleges = await College.find();
    const studentDistribution = await Promise.all(
      colleges.map(async (college) => {
        const count = await User.countDocuments({
          role: 'student',
          collegeId: college._id,
        });
        return {
          name: college.name,
          students: count,
        };
      })
    );

    // Get faculty distribution by college
    const facultyDistribution = await Promise.all(
      colleges.map(async (college) => {
        const count = await User.countDocuments({
          role: 'college_admin',
          collegeId: college._id,
        });
        return {
          name: college.name,
          faculty: count,
        };
      })
    );

    // Get programs by college
    const programsByCollege = await Program.aggregate([
      {
        $lookup: {
          from: 'colleges',
          localField: 'college',
          foreignField: '_id',
          as: 'collegeInfo',
        },
      },
      {
        $unwind: '$collegeInfo',
      },
      {
        $group: {
          _id: '$collegeInfo.name',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          programs: '$count',
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        studentDistribution,
        facultyDistribution,
        programsByCollege,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/university/college-admins
// @desc    Get college admins across all colleges
// @access  Private (University Admin)
router.get('/college-admins', async (req, res) => {
  try {
    const collegeAdmins = await User.find({ role: 'college_admin' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: collegeAdmins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/university/college-admins
// @desc    Create a new college admin (only university admins)
// @access  Private (University Admin)
router.post('/college-admins', async (req, res) => {
  try {
    const { name, email, password, collegeId, facultyInfo } = req.body;

    if (!name || !email || !password || !collegeId) {
      return res.status(400).json({
        success: false,
        message: 'name, email, password and collegeId are required',
      });
    }

    const resolvedCollegeId = await normalizeCollegeId(collegeId);
    if (!resolvedCollegeId) {
      return res.status(400).json({ success: false, message: 'Invalid collegeId. Use a valid ObjectId or college code.' });
    }

    const college = await College.findById(resolvedCollegeId);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    collegeId = resolvedCollegeId;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const collegeAdmin = await User.create({
      name,
      email,
      password,
      role: 'college_admin',
      collegeId,
      facultyInfo,
    });

    res.status(201).json({ success: true, data: collegeAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
