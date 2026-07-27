import express from 'express';
import crmController from '../controllers/crmController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Clientes
router.get('/customers', crmController.getCustomers);
router.get('/customers/:id', crmController.getCustomerById);
router.post('/customers', crmController.createCustomer);
router.put('/customers/:id', crmController.updateCustomer);
router.delete('/customers/:id', crmController.deleteCustomer);

// Contactos
router.get('/customers/:id/contacts', crmController.getCustomerContacts);
router.post('/customers/:id/contacts', crmController.addContact);
router.delete('/contacts/:id', crmController.deleteContact);

// Interacciones
router.get('/customers/:id/interactions', crmController.getInteractions);
router.post('/customers/:id/interactions', crmController.createInteraction);
router.put('/interactions/:id', crmController.updateInteraction);

// Expedientes
router.get('/customers/:id/documents', crmController.getDocuments);
router.post('/customers/:id/documents', crmController.uploadDocument);
router.delete('/documents/:id', crmController.deleteDocument);

export default router;
