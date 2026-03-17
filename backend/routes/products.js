const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getFeaturedProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProduct);

module.exports = router;
