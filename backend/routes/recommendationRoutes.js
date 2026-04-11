const express = require('express');
const router = express.Router();
const { updateRecommendations, getRecommendations } = require('../controllers/recommendationController');
const { protect, adminOnly } = require('../middleware/auth'); 

router.route('/')
  .post(protect, adminOnly, updateRecommendations);

router.route('/:productId')
  .get(getRecommendations);

module.exports = router;
