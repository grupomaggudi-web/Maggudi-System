import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import Warehouse from '../../models/Warehouse.js';
import Stock from '../../models/Stock.js';
import Movement from '../../models/Movement.js';

const inventoryController = {
  // Productos
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({ include: [Category] });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, { include: [Category] });
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { name, description, price, categoryId, sku, barcode } = req.body;
      const product = await Product.create({
        name,
        description,
        price,
        categoryId,
        sku,
        barcode,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      await product.update(req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      await product.destroy();
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Categorías
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ name, description });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
      await category.update(req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
      await category.destroy();
      res.json({ message: 'Categoría eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Almacenes
  getWarehouses: async (req, res) => {
    try {
      const warehouses = await Warehouse.findAll();
      res.json(warehouses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWarehouse: async (req, res) => {
    try {
      const { name, location, capacity } = req.body;
      const warehouse = await Warehouse.create({ name, location, capacity });
      res.status(201).json(warehouse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Stock
  getStock: async (req, res) => {
    try {
      const { warehouseId, productId } = req.query;
      let where = {};
      if (warehouseId) where.warehouseId = warehouseId;
      if (productId) where.productId = productId;
      
      const stocks = await Stock.findAll({ where, include: [Product, Warehouse] });
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  adjustStock: async (req, res) => {
    try {
      const { productId, warehouseId, quantity, reason } = req.body;
      
      let stock = await Stock.findOne({
        where: { productId, warehouseId },
      });
      
      if (!stock) {
        stock = await Stock.create({ productId, warehouseId, quantity: 0 });
      }
      
      const oldQuantity = stock.quantity;
      stock.quantity += quantity;
      await stock.save();
      
      // Registrar movimiento
      await Movement.create({
        productId,
        warehouseId,
        type: quantity > 0 ? 'entrada' : 'salida',
        quantity: Math.abs(quantity),
        reason,
        oldQuantity,
        newQuantity: stock.quantity,
        createdBy: req.user.id,
      });
      
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  transferStock: async (req, res) => {
    try {
      const { productId, fromWarehouseId, toWarehouseId, quantity } = req.body;
      
      // Salida del almacén origen
      const fromStock = await Stock.findOne({
        where: { productId, warehouseId: fromWarehouseId },
      });
      if (!fromStock || fromStock.quantity < quantity) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
      fromStock.quantity -= quantity;
      await fromStock.save();
      
      // Entrada al almacén destino
      let toStock = await Stock.findOne({
        where: { productId, warehouseId: toWarehouseId },
      });
      if (!toStock) {
        toStock = await Stock.create({ productId, warehouseId: toWarehouseId, quantity });
      } else {
        toStock.quantity += quantity;
        await toStock.save();
      }
      
      // Registrar movimientos
      await Movement.create({
        productId,
        warehouseId: fromWarehouseId,
        type: 'transferencia_salida',
        quantity,
        reason: `Transferencia a almacén ${toWarehouseId}`,
        createdBy: req.user.id,
      });
      
      await Movement.create({
        productId,
        warehouseId: toWarehouseId,
        type: 'transferencia_entrada',
        quantity,
        reason: `Transferencia desde almacén ${fromWarehouseId}`,
        createdBy: req.user.id,
      });
      
      res.json({ fromStock, toStock });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Movimientos
  getMovements: async (req, res) => {
    try {
      const movements = await Movement.findAll({
        include: [Product, Warehouse],
        order: [['createdAt', 'DESC']],
        limit: 100,
      });
      res.json(movements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createMovement: async (req, res) => {
    try {
      const movement = await Movement.create({
        ...req.body,
        createdBy: req.user.id,
      });
      res.status(201).json(movement);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default inventoryController;
