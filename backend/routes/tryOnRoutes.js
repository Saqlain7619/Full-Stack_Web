const express = require('express');
const router = express.Router();
const tryOnController = require('../controllers/tryOnController');
const { protect } = require('../middleware/auth'); // Optional: only logged in users

router.post('/', tryOnController.generateTryOn);

module.exports = router;
