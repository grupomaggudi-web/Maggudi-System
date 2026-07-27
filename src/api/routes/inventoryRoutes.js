import express from 'express';
import inventoryController from '../controllers/inventoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
  createWarehouseSchema,
  adjustStockSchema,
  transferStockSchema,
} from '../validations/inventoryValidation.js';

const router = express.Router();

router.use(authMiddleware);

// Productos
router.get('/products', inventoryController.getProducts);
router.get('/products/:id', inventoryController.getProductById);
router.post('/products', validateRequest(createProductSchema), inventoryController.createProduct);
router.put('/products/:id', validateRequest(updateProductSchema), inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

// Categorías
router.get('/categories', inventoryController.getCategories);
router.post('/categories', validateRequest(createCategorySchema), inventoryController.createCategory);
router.put('/categories/:id', validateRequest(createCategorySchema), inventoryController.updateCategory);
router.delete('/categories/:id', inventoryController.deleteCategory);

// Almacenes
router.get('/warehouses', inventoryController.getWarehouses);
router.post('/warehouses', validateRequest(createWarehouseSchema), inventoryController.createWarehouse);

// Stock
router.get('/stock', inventoryController.getStock);
router.post('/stock/adjust', validateRequest(adjustStockSchema), inventoryController.adjustStock);
router.post('/stock/transfer', validateRequest(transferStockSchema), inventoryController.transferStock);

// Movimientos
router.get('/movements', inventoryController.getMovements);
router.post('/movements', inventoryController.createMovement);

export default router;
