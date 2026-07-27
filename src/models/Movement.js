import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movement = sequelize.define('Movement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  warehouseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('entrada', 'salida', 'transferencia_entrada', 'transferencia_salida', 'ajuste'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  oldQuantity: {
    type: DataTypes.INTEGER,
  },
  newQuantity: {
    type: DataTypes.INTEGER,
  },
  reason: {
    type: DataTypes.TEXT,
  },
  createdBy: {
    type: DataTypes.UUID,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default Movement;
