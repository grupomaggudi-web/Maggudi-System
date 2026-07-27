import Customer from '../../models/Customer.js';
import Contact from '../../models/Contact.js';
import Interaction from '../../models/Interaction.js';
import Document from '../../models/Document.js';

const crmController = {
  // Clientes
  getCustomers: async (req, res) => {
    try {
      const customers = await Customer.findAll({
        include: [Contact],
      });
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id, {
        include: [Contact, Interaction, Document],
      });
      if (!customer) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCustomer: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        taxId,
        status,
      } = req.body;

      const customer = await Customer.create({
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        taxId,
        status: status || 'lead',
      });

      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateCustomer: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) return res.status(404).json({ error: 'Cliente no encontrado' });
      await customer.update(req.body);
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) return res.status(404).json({ error: 'Cliente no encontrado' });
      await customer.destroy();
      res.json({ message: 'Cliente eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Contactos
  getCustomerContacts: async (req, res) => {
    try {
      const contacts = await Contact.findAll({
        where: { customerId: req.params.id },
      });
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addContact: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, position } = req.body;
      const contact = await Contact.create({
        customerId: req.params.id,
        firstName,
        lastName,
        email,
        phone,
        position,
      });
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const contact = await Contact.findByPk(req.params.id);
      if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });
      await contact.destroy();
      res.json({ message: 'Contacto eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Interacciones
  getInteractions: async (req, res) => {
    try {
      const interactions = await Interaction.findAll({
        where: { customerId: req.params.id },
        order: [['createdAt', 'DESC']],
      });
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createInteraction: async (req, res) => {
    try {
      const { type, notes, date } = req.body;
      const interaction = await Interaction.create({
        customerId: req.params.id,
        type,
        notes,
        date: date || new Date(),
        createdBy: req.user.id,
      });
      res.status(201).json(interaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateInteraction: async (req, res) => {
    try {
      const interaction = await Interaction.findByPk(req.params.id);
      if (!interaction) return res.status(404).json({ error: 'Interacción no encontrada' });
      await interaction.update(req.body);
      res.json(interaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Documentos
  getDocuments: async (req, res) => {
    try {
      const documents = await Document.findAll({
        where: { customerId: req.params.id },
      });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  uploadDocument: async (req, res) => {
    try {
      const { fileName, documentType, url } = req.body;
      const document = await Document.create({
        customerId: req.params.id,
        fileName,
        documentType,
        url,
        uploadedBy: req.user.id,
      });
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteDocument: async (req, res) => {
    try {
      const document = await Document.findByPk(req.params.id);
      if (!document) return res.status(404).json({ error: 'Documento no encontrado' });
      await document.destroy();
      res.json({ message: 'Documento eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default crmController;
