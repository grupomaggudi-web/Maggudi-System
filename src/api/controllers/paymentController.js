import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../../models/Payment.js';
import Invoice from '../../models/Invoice.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentController = {
  // Crear sesión de pago
  createPaymentIntent: async (req, res) => {
    try {
      const { amount, currency = 'USD', invoiceId, description } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convertir a centavos
        currency,
        description,
        metadata: {
          invoiceId,
          userId: req.user.id,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Confirmar pago
  confirmPayment: async (req, res) => {
    try {
      const { paymentIntentId, invoiceId } = req.body;

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Registrar pago en BD
        const payment = await Payment.create({
          invoiceId,
          amount: paymentIntent.amount / 100,
          paymentMethod: 'stripe',
          reference: paymentIntentId,
          paymentDate: new Date(),
          status: 'completed',
          recordedBy: req.user.id,
        });

        // Actualizar estado de factura
        const invoice = await Invoice.findByPk(invoiceId);
        const totalPaid = await Payment.sum('amount', {
          where: { invoiceId },
        });

        if (totalPaid >= invoice.total) {
          invoice.status = 'paid';
          await invoice.save();
        }

        res.json({ success: true, payment });
      } else {
        res.status(400).json({ error: 'Pago no completado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Webhook de Stripe
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('Pago exitoso:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          console.log('Pago fallido:', event.data.object);
          break;
        default:
          console.log(`Evento no manejado: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Crear suscripción
  createSubscription: async (req, res) => {
    try {
      const { priceId, customerId } = req.body;

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
      });

      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Listar pagos
  getPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll({
        include: ['invoice'],
        order: [['createdAt', 'DESC']],
      });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener detalles de pago
  getPaymentById: async (req, res) => {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: ['invoice'],
      });
      if (!payment) return res.status(404).json({ error: 'Pago no encontrado' });
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default paymentController;
