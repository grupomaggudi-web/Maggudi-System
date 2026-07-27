import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Stock = sequelize.define('Stock', {
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
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  minimumQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  maximumQuantity: {
    type: DataTypes.INTEGER,
  },
  expirationDate: {
    type: DataTypes.DATE,
  },
}, {
  paranoid: true,
  timestamps: true,
});

export default Stock;
