const prisma = require('../config/database');
const crypto = require('crypto');

// Helper to format date for JazzCash (YYYYMMDDHHMMSS)
const getJazzCashDate = () => {
  const date = new Date();
  return date.toISOString().replace(/[-:T]/g, '').slice(0, 14);
};

// Helper: Generate JazzCash Secure Hash
const generateJazzCashHash = (payload, salt) => {
  const keys = Object.keys(payload).filter(k => k !== 'pp_SecureHash' && payload[k] !== '' && payload[k] !== null);
  keys.sort();
  
  let hashString = salt;
  keys.forEach(key => {
    hashString += '&' + payload[key];
  });
  
  // JazzCash uses HMAC SHA256 with the salt as the key 
  return crypto.createHmac('sha256', salt).update(hashString).digest('hex');
};

exports.initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Auth from req.user set by your auth middleware
    const userId = req.user.id;

    // Fetch the order
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    if (order.paymentMethod !== 'JAZZCASH') {
      return res.status(400).json({ success: false, message: 'Payment method is not JazzCash' });
    }

    // JazzCash expects amount in paisas (e.g., PKR 100.00 = 10000)
    // Always round securely to avoid decimals
    const amountInPaisas = Math.round(order.total * 100).toString();
    const expiryDateTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
    const formattedExpiry = expiryDateTime.toISOString().replace(/[-:T]/g, '').slice(0, 14);

    // Build standard JazzCash Payload
    let payload = {
      pp_Version: '1.1', // Verify with your specific gateway documentation
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_BankID: '',
      pp_ProductID: '',
      pp_TxnRefNo: order.orderNumber, // Use our unique order number
      pp_Amount: amountInPaisas,
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: getJazzCashDate(),
      pp_BillReference: `bill-${order.orderNumber}`,
      pp_Description: 'E-commerce Purchase',
      pp_TxnExpiryDateTime: formattedExpiry,
      pp_ReturnURL: `http://localhost:5000/api/payments/return`, // Route to handle POST from JazzCash and redirect to Frontend
      pp_SecureHash: '',
      // Add webhook url if your account supports asynchronous server-to-server IPN callbacks
      // pp_WebhookURL: `http://localhost:5000/api/payments/webhook`,
    };

    // Calculate Secure Hash
    payload.pp_SecureHash = generateJazzCashHash(payload, process.env.JAZZCASH_INTEGRITY_SALT);

    res.json({
      success: true,
      gatewayUrl: process.env.JAZZCASH_GATEWAY_URL || 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/',
      payload
    });

  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate payment' });
  }
};

exports.paymentWebhook = async (req, res) => {
  try {
    const payload = req.body;
    
    // IMPORTANT: Verify the signature from JazzCash to prevent spoofing
    const isValid = generateJazzCashHash(payload, process.env.JAZZCASH_INTEGRITY_SALT) === payload.pp_SecureHash;
    
    if (!isValid) {
      console.warn("Invalid JazzCash Webhook Signature", payload);
      return res.status(401).json({ success: false, message: "Invalid signature" });
    }

    const orderNumber = payload.pp_TxnRefNo;

    const order = await prisma.order.findUnique({
      where: { orderNumber }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Idempotency: Ignore if already processed
    if (order.paymentStatus === 'PAID') {
      return res.status(200).json({ success: true, message: 'Already processed' });
    }

    // Amount match validation: Payload amount is in Paisas.
    const expectedAmountInPaisas = Math.round(order.total * 100);
    if (parseInt(payload.pp_Amount) !== expectedAmountInPaisas) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'FAILED', notes: 'Amount mismatch detected' }
      });
      return res.status(400).json({ success: false, message: 'Amount mismatch' });
    }

    // JazzCash Response Codes: usually '000' is success.
    if (payload.pp_ResponseCode === '000') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          transactionId: payload.pp_RetreivalReferenceNo || payload.pp_BankID, 
          paymentGateway: 'JAZZCASH',
          paymentData: payload, // Store raw response for audit
          paidAt: new Date()
        }
      });
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
          status: 'CANCELLED',
          notes: `Failed. Response Code: ${payload.pp_ResponseCode}, Msg: ${payload.pp_ResponseMessage}`,
          paymentData: payload
        }
      });
    }

    // Must return 200 OK so JazzCash knows we received it
    res.status(200).json({ success: true, message: 'Webhook received properly' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, message: 'Server error processing webhook' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: req.user.id },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
        status: true,
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching payment status' });
  }
};

exports.paymentReturn = async (req, res) => {
  try {
    const payload = req.body;
    
    // Validate signature first (optional but highly recommended even on return)
    const isValid = generateJazzCashHash(payload, process.env.JAZZCASH_INTEGRITY_SALT) === payload.pp_SecureHash;
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Redirect User back to frontend based on status
    if (isValid && payload.pp_ResponseCode === '000') {
      const orderNumber = payload.pp_TxnRefNo;
      const order = await prisma.order.findUnique({ where: { orderNumber } });
      res.redirect(`${frontendUrl}/orders/${order?.id || ''}?payment=success`);
    } else {
      res.redirect(`${frontendUrl}/cart?payment=failed&msg=${encodeURIComponent(payload.pp_ResponseMessage || "Payment Failed")}`);
    }
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart?payment=error`);
  }
};
