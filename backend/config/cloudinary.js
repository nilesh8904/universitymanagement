const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'university-management',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
