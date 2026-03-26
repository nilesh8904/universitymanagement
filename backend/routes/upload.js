const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const Material = require('../models/Material');

// @route   POST /api/upload/single
// @desc    Upload a single file to Cloudinary
// @access  Private
router.post('/single', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.json({
      success: true,
      data: {
        url: req.file.path,
        filename: req.file.filename,
        cloudinaryId: req.file.filename,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files to Cloudinary
// @access  Private
router.post('/multiple', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
      cloudinaryId: file.filename,
      fileType: file.mimetype,
      fileSize: file.size,
    }));

    res.json({
      success: true,
      data: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/upload/material
// @desc    Upload course material (file or Cloudinary URL)
// @access  Private (Faculty/Admin)
router.post('/material', protect, upload.single('file'), async (req, res) => {
  try {
    const { title, description, courseId, url, type } = req.body;

    if (!title || !courseId || (!req.file && !url)) {
      return res.status(400).json({
        success: false,
        message: 'title, courseId, and either file or url are required',
      });
    }

    // Validate courseId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid courseId: "${courseId}". Must be a valid MongoDB ObjectId.`,
      });
    }

    const materialUrl = req.file ? req.file.path : url;
    const materialType = type || 'video';

    const material = await Material.create({
      title,
      description,
      course: courseId,
      college: req.user.collegeId,
      uploadedBy: req.user._id,
      type: materialType,
      url: materialUrl,
      fileSize: req.file ? req.file.size : undefined,
      uploadedAt: new Date(),
    });

    await material.populate('course', 'name code');
    await material.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      data: material,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/upload/materials/:courseId
// @desc    Get all materials for a course
// @access  Private
router.get('/materials/:courseId', protect, async (req, res) => {
  try {
    const materials = await Material.find({ course: req.params.courseId })
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

// @route   DELETE /api/upload/material/:id
// @desc    Delete a material
// @access  Private (Faculty/Admin)
router.delete('/material/:id', protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    // Check if user is authorized to delete
    if (
      material.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'university_admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this material',
      });
    }

    await material.deleteOne();

    res.json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
