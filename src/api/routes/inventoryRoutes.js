import express from 'express';
import inventoryController from '../controllers/inventoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Productos
router.get('/products', inventoryController.getProducts);
router.get('/products/:id', inventoryController.getProductById);
router.post('/products', inventoryController.createProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

// Categorías
router.get('/categories', inventoryController.getCategories);
router.post('/categories', inventoryController.createCategory);
router.put('/categories/:id', inventoryController.updateCategory);
router.delete('/categories/:id', inventoryController.deleteCategory);

// Almacenes
router.get('/warehouses', inventoryController.getWarehouses);
router.post('/warehouses', inventoryController.createWarehouse);

// Stock
router.get('/stock', inventoryController.getStock);
router.post('/stock/adjust', inventoryController.adjustStock);
router.post('/stock/transfer', inventoryController.transferStock);

// Movimientos
router.get('/movements', inventoryController.getMovements);
router.post('/movements', inventoryController.createMovement);

export default router;
