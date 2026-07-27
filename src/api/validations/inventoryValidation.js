import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().max(1000),
  price: Joi.number().required().positive(),
  cost: Joi.number().positive(),
  categoryId: Joi.string().uuid(),
  sku: Joi.string().required().alphanum(),
  barcode: Joi.string(),
  isActive: Joi.boolean(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(1000),
  price: Joi.number().positive(),
  cost: Joi.number().positive(),
  categoryId: Joi.string().uuid(),
  sku: Joi.string().alphanum(),
  barcode: Joi.string(),
  isActive: Joi.boolean(),
}).min(1);

export const createCategorySchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().max(500),
  isActive: Joi.boolean(),
});

export const createWarehouseSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  location: Joi.string().required(),
  capacity: Joi.number().integer().positive(),
  isActive: Joi.boolean(),
});

export const adjustStockSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  warehouseId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().required(),
  reason: Joi.string().required(),
});

export const transferStockSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  fromWarehouseId: Joi.string().uuid().required(),
  toWarehouseId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().positive().required(),
});
