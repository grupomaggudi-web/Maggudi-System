import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
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
  department: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  salary: {
    type: DataTypes.DECIMAL(12, 2),
  },
  hireDate: {
    type: DataTypes.DATE,
  },
  birthDate: {
    type: DataTypes.DATE,
  },
  identificationNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
  },
  bankAccount: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'on_leave', 'terminated'),
    defaultValue: 'active',
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default Employee;
