import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  invoiceDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  items: {
    type: DataTypes.JSON,
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
  },
  tax: {
    type: DataTypes.DECIMAL(12, 2),
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'viewed', 'paid', 'cancelled'),
    defaultValue: 'draft',
  },
  sentDate: {
    type: DataTypes.DATE,
  },
  createdBy: {
    type: DataTypes.UUID,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default Invoice;
