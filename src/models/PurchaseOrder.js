import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  purchaseOrderNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expectedDeliveryDate: {
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
    type: DataTypes.ENUM('draft', 'sent', 'confirmed', 'received', 'cancelled'),
    defaultValue: 'draft',
  },
  notes: {
    type: DataTypes.TEXT,
  },
  createdBy: {
    type: DataTypes.UUID,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default PurchaseOrder;
