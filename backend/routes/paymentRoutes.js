const express = require('express');
const router = express.Router();
const { initiatePayment, paymentWebhook, verifyPayment, paymentReturn } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth'); // assuming your project has standard protect middleware here

// Initialize payment (requires logged-in user)
router.post('/initiate', protect, initiatePayment);

// Webhook / Callback - MUST be publicly accessible without 'protect' 
// so the gateway can reach it. It verifies the HMAC secure hash internally.
router.post('/webhook', paymentWebhook);

// Return URL for form submission
router.post('/return', paymentReturn);

// Check payment status on frontend success page
router.get('/verify/:orderId', protect, verifyPayment);

module.exports = router;
