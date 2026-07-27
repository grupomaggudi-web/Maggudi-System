import Supplier from '../../models/Supplier.js';
import PurchaseOrder from '../../models/PurchaseOrder.js';
import AccountPayable from '../../models/AccountPayable.js';

const buyingController = {
  // Proveedores
  getSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.findAll();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSupplierById: async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id);
      if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createSupplier: async (req, res) => {
    try {
      const supplier = await Supplier.create(req.body);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateSupplier: async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id);
      if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
      await supplier.update(req.body);
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id);
      if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });
      await supplier.destroy();
      res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Órdenes de Compra
  getPurchaseOrders: async (req, res) => {
    try {
      const orders = await PurchaseOrder.findAll({ include: ['supplier'] });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPurchaseOrderById: async (req, res) => {
    try {
      const order = await PurchaseOrder.findByPk(req.params.id, { include: ['supplier'] });
      if (!order) return res.status(404).json({ error: 'Orden de compra no encontrada' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createPurchaseOrder: async (req, res) => {
    try {
      const {
        supplierId,
        items,
        subtotal,
        tax,
        total,
        expectedDeliveryDate,
        notes,
      } = req.body;

      const purchaseOrderNumber = `PO-${Date.now()}`;
      const order = await PurchaseOrder.create({
        supplierId,
        purchaseOrderNumber,
        items,
        subtotal,
        tax,
        total,
        expectedDeliveryDate,
        notes,
        status: 'draft',
        createdBy: req.user.id,
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updatePurchaseOrder: async (req, res) => {
    try {
      const order = await PurchaseOrder.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Orden de compra no encontrada' });
      await order.update(req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updatePurchaseOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await PurchaseOrder.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Orden de compra no encontrada' });

      order.status = status;
      await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletePurchaseOrder: async (req, res) => {
    try {
      const order = await PurchaseOrder.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Orden de compra no encontrada' });
      await order.destroy();
      res.json({ message: 'Orden de compra eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cuentas por Pagar
  getAccountsPayable: async (req, res) => {
    try {
      const accounts = await AccountPayable.findAll({
        include: ['supplier'],
        order: [['dueDate', 'ASC']],
      });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAccountPayableById: async (req, res) => {
    try {
      const account = await AccountPayable.findByPk(req.params.id, {
        include: ['supplier', 'purchaseOrder'],
      });
      if (!account) return res.status(404).json({ error: 'Cuenta por pagar no encontrada' });
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createAccountPayable: async (req, res) => {
    try {
      const {
        supplierId,
        purchaseOrderId,
        invoiceNumber,
        invoiceDate,
        dueDate,
        amount,
      } = req.body;

      const account = await AccountPayable.create({
        supplierId,
        purchaseOrderId,
        invoiceNumber,
        invoiceDate,
        dueDate,
        amount,
        status: 'pending',
      });

      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  recordPayment: async (req, res) => {
    try {
      const { amount } = req.body;
      const account = await AccountPayable.findByPk(req.params.id);
      if (!account) return res.status(404).json({ error: 'Cuenta por pagar no encontrada' });

      const newAmountPaid = parseFloat(account.amountPaid) + parseFloat(amount);
      const newStatus = newAmountPaid >= account.amount ? 'paid' : 'partial';

      account.amountPaid = newAmountPaid;
      account.status = newStatus;
      await account.save();

      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPayablesSummary: async (req, res) => {
    try {
      const pending = await AccountPayable.sum('amount', {
        where: { status: ['pending', 'partial'] },
      });
      const paid = await AccountPayable.sum('amount', {
        where: { status: 'paid' },
      });
      const overdue = await AccountPayable.findAll({
        where: { status: 'overdue' },
        raw: true,
      });

      res.json({
        totalPending: pending || 0,
        totalPaid: paid || 0,
        overdueItems: overdue.length,
        totalOverdue: overdue.reduce((sum, item) => sum + item.amount, 0),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default buyingController;
