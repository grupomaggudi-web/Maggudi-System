import express from 'express';
import buyingController from '../controllers/buyingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Proveedores
router.get('/suppliers', buyingController.getSuppliers);
router.get('/suppliers/:id', buyingController.getSupplierById);
router.post('/suppliers', buyingController.createSupplier);
router.put('/suppliers/:id', buyingController.updateSupplier);
router.delete('/suppliers/:id', buyingController.deleteSupplier);

// Órdenes de Compra
router.get('/purchase-orders', buyingController.getPurchaseOrders);
router.get('/purchase-orders/:id', buyingController.getPurchaseOrderById);
router.post('/purchase-orders', buyingController.createPurchaseOrder);
router.put('/purchase-orders/:id', buyingController.updatePurchaseOrder);
router.put('/purchase-orders/:id/status', buyingController.updatePurchaseOrderStatus);
router.delete('/purchase-orders/:id', buyingController.deletePurchaseOrder);

// Cuentas por Pagar
router.get('/accounts-payable', buyingController.getAccountsPayable);
router.get('/accounts-payable/:id', buyingController.getAccountPayableById);
router.post('/accounts-payable', buyingController.createAccountPayable);
router.post('/accounts-payable/:id/payment', buyingController.recordPayment);
router.get('/payables-summary', buyingController.getPayablesSummary);

export default router;
