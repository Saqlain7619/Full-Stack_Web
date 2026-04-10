const router = require('express').Router();
const { getProducts, getProduct, getFeatured, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');


router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
