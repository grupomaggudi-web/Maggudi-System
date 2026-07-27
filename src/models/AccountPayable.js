import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AccountPayable = sequelize.define('AccountPayable', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  purchaseOrderId: {
    type: DataTypes.UUID,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
  },
  invoiceDate: {
    type: DataTypes.DATE,
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
  },
  status: {
    type: DataTypes.ENUM('pending', 'partial', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'pending',
  },
  amountPaid: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default AccountPayable;
