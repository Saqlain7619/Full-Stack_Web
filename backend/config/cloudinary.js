const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');

// Ensure uploads directory exists for local fallback
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce/products',
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  },
});

const upload = process.env.CLOUDINARY_CLOUD_NAME
  ? multer({ storage })
  : multer({ storage: localStorage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { cloudinary, upload };
