import Joi from 'joi';

export const createCustomerSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  address: Joi.string().max(200),
  city: Joi.string().max(50),
  state: Joi.string().max(50),
  zipCode: Joi.string().max(20),
  country: Joi.string().max(50),
  taxId: Joi.string().max(50),
  status: Joi.string().valid('lead', 'prospect', 'customer', 'inactive'),
  notes: Joi.string().max(1000),
});

export const updateCustomerSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  address: Joi.string().max(200),
  city: Joi.string().max(50),
  state: Joi.string().max(50),
  zipCode: Joi.string().max(20),
  country: Joi.string().max(50),
  taxId: Joi.string().max(50),
  status: Joi.string().valid('lead', 'prospect', 'customer', 'inactive'),
  notes: Joi.string().max(1000),
}).min(1);

export const createContactSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  position: Joi.string().max(50),
  isPrimary: Joi.boolean(),
});

export const createInteractionSchema = Joi.object({
  type: Joi.string().valid('call', 'email', 'meeting', 'note', 'task').required(),
  notes: Joi.string().required().min(5).max(1000),
  date: Joi.date(),
});

export const uploadDocumentSchema = Joi.object({
  fileName: Joi.string().required().min(3),
  documentType: Joi.string().required(),
  url: Joi.string().uri().required(),
});
