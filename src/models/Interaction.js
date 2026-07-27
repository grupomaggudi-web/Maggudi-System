import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Interaction = sequelize.define('Interaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('call', 'email', 'meeting', 'note', 'task'),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  createdBy: {
    type: DataTypes.UUID,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default Interaction;
