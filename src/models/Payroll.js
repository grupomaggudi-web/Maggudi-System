import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payroll = sequelize.define('Payroll', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  period: {
    type: DataTypes.STRING,
  },
  baseSalary: {
    type: DataTypes.DECIMAL(12, 2),
  },
  bonuses: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  deductions: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  taxes: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  netSalary: {
    type: DataTypes.DECIMAL(12, 2),
  },
  status: {
    type: DataTypes.ENUM('pending', 'processed', 'paid', 'cancelled'),
    defaultValue: 'pending',
  },
  paymentDate: {
    type: DataTypes.DATE,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default Payroll;
