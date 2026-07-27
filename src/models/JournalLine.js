import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const JournalLine = sequelize.define('JournalLine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  journalEntryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  accountCode: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  debit: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  credit: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default JournalLine;
