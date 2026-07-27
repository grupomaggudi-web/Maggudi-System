import express from 'express';
import salesController from '../controllers/salesController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Órdenes de venta
router.get('/orders', salesController.getOrders);
router.get('/orders/:id', salesController.getOrderById);
router.post('/orders', salesController.createOrder);
router.put('/orders/:id', salesController.updateOrder);
router.delete('/orders/:id', salesController.deleteOrder);

// Facturación
router.get('/invoices', salesController.getInvoices);
router.get('/invoices/:id', salesController.getInvoiceById);
router.post('/orders/:orderId/invoice', salesController.createInvoice);
router.post('/invoices/:id/send', salesController.sendInvoice);

// Estados de orden
router.put('/orders/:id/status', salesController.updateOrderStatus);

// Pagos
router.get('/payments', salesController.getPayments);
router.post('/invoices/:invoiceId/payment', salesController.recordPayment);

export default router;
