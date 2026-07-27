import Joi from 'joi';

export const createAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/),
  firstName: Joi.string().required().min(2),
  lastName: Joi.string().required().min(2),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required().min(2),
  lastName: Joi.string().required().min(2),
  role: Joi.string().valid('admin', 'manager', 'user').default('user'),
  isActive: Joi.boolean(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  firstName: Joi.string().min(2),
  lastName: Joi.string().min(2),
  role: Joi.string().valid('admin', 'manager', 'user'),
  isActive: Joi.boolean(),
}).min(1);
