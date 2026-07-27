import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkInTime: {
    type: DataTypes.TIME,
  },
  checkOutTime: {
    type: DataTypes.TIME,
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'half_day', 'vacation'),
    defaultValue: 'present',
  },
  hoursWorked: {
    type: DataTypes.DECIMAL(5, 2),
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default Attendance;
