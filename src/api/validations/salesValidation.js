import Joi from 'joi';

export const createOrderSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  orderDate: Joi.date(),
  dueDate: Joi.date().min(Joi.ref('orderDate')),
  items: Joi.array().items(Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().positive().required(),
    unitPrice: Joi.number().positive().required(),
  })).required(),
  subtotal: Joi.number().positive().required(),
  tax: Joi.number().positive(),
  total: Joi.number().positive().required(),
  notes: Joi.string().max(1000),
});

export const updateOrderSchema = Joi.object({
  orderDate: Joi.date(),
  dueDate: Joi.date(),
  items: Joi.array().items(Joi.object({
    productId: Joi.string().uuid(),
    quantity: Joi.number().integer().positive(),
    unitPrice: Joi.number().positive(),
  })),
  subtotal: Joi.number().positive(),
  tax: Joi.number().positive(),
  total: Joi.number().positive(),
  notes: Joi.string().max(1000),
}).min(1);

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').required(),
});

export const recordPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().required().max(50),
  reference: Joi.string().max(100),
});
