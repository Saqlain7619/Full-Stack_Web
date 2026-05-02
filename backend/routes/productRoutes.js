const router = require('express').Router();
const { getProducts, getProduct, getFeatured, createProduct, updateProduct, deleteProduct, getRecommendationOptions, bulkUploadProducts } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.post('/bulk-upload', protect, adminOnly, bulkUploadProducts);
router.get('/featured', getFeatured);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'avatarImage', maxCount: 1 }]), createProduct);
router.put('/:id', protect, adminOnly, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'avatarImage', maxCount: 1 }]), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

router.get('/recommendation-options/:categoryId', getRecommendationOptions);

module.exports = router;
