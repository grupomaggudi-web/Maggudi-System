import express from 'express';
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas (webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Rutas protegidas
router.use(authMiddleware);

router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.get('/list', paymentController.getPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/subscribe', paymentController.createSubscription);

export default router;
