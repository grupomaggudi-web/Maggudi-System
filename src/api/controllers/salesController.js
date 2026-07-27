import SalesOrder from '../../models/SalesOrder.js';
import Invoice from '../../models/Invoice.js';
import Payment from '../../models/Payment.js';
import Customer from '../../models/Customer.js';
import Product from '../../models/Product.js';

const salesController = {
  // Órdenes de venta
  getOrders: async (req, res) => {
    try {
      const orders = await SalesOrder.findAll({
        include: [Customer, Product],
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const order = await SalesOrder.findByPk(req.params.id, {
        include: [Customer, Product, Invoice, Payment],
      });
      if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createOrder: async (req, res) => {
    try {
      const {
        customerId,
        orderDate,
        dueDate,
        items,
        subtotal,
        tax,
        total,
        notes,
      } = req.body;

      const order = await SalesOrder.create({
        customerId,
        orderDate: orderDate || new Date(),
        dueDate,
        items,
        subtotal,
        tax,
        total,
        notes,
        status: 'pending',
        createdBy: req.user.id,
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const order = await SalesOrder.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
      await order.update(req.body);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await SalesOrder.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
      await order.destroy();
      res.json({ message: 'Orden eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Facturación
  getInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        include: [Customer, SalesOrder],
      });
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getInvoiceById: async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id, {
        include: [Customer, SalesOrder, Payment],
      });
      if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createInvoice: async (req, res) => {
    try {
      const order = await SalesOrder.findByPk(req.params.orderId);
      if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

      const invoiceNumber = `INV-${Date.now()}`;
      const invoice = await Invoice.create({
        orderId: req.params.orderId,
        invoiceNumber,
        invoiceDate: new Date(),
        dueDate: req.body.dueDate,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: 'draft',
        items: order.items,
        createdBy: req.user.id,
      });

      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  sendInvoice: async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });

      // TODO: Integrar envío por email
      invoice.status = 'sent';
      invoice.sentDate = new Date();
      await invoice.save();

      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await SalesOrder.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

      order.status = status;
      await order.save();

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Pagos
  getPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  recordPayment: async (req, res) => {
    try {
      const { amount, paymentMethod, reference } = req.body;
      const invoice = await Invoice.findByPk(req.params.invoiceId);
      if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });

      const payment = await Payment.create({
        invoiceId: req.params.invoiceId,
        amount,
        paymentMethod,
        reference,
        paymentDate: new Date(),
        status: 'completed',
        recordedBy: req.user.id,
      });

      // Actualizar estado de la factura
      const totalPaid = await Payment.sum('amount', {
        where: { invoiceId: req.params.invoiceId },
      });

      if (totalPaid >= invoice.total) {
        invoice.status = 'paid';
        await invoice.save();
      }

      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default salesController;
