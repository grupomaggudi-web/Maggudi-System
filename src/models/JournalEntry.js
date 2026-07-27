import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const JournalEntry = sequelize.define('JournalEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  entryNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
  },
  referenceType: {
    type: DataTypes.STRING,
  },
  referenceId: {
    type: DataTypes.UUID,
  },
  status: {
    type: DataTypes.ENUM('draft', 'posted', 'cancelled'),
    defaultValue: 'draft',
  },
  createdBy: {
    type: DataTypes.UUID,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default JournalEntry;
