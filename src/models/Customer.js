import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  zipCode: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  taxId: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('lead', 'prospect', 'customer', 'inactive'),
    defaultValue: 'lead',
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default Customer;
