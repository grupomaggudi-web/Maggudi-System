import Product from './Product.js';
import Category from './Category.js';
import Warehouse from './Warehouse.js';
import Stock from './Stock.js';
import Movement from './Movement.js';
import Customer from './Customer.js';
import Contact from './Contact.js';
import Interaction from './Interaction.js';
import Document from './Document.js';
import SalesOrder from './SalesOrder.js';
import Invoice from './Invoice.js';
import Payment from './Payment.js';
import User from './User.js';

// Relaciones: Inventario
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

Stock.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Stock, { foreignKey: 'productId', as: 'stocks' });

Stock.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
Warehouse.hasMany(Stock, { foreignKey: 'warehouseId', as: 'stocks' });

Movement.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Movement, { foreignKey: 'productId', as: 'movements' });

Movement.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
Warehouse.hasMany(Movement, { foreignKey: 'warehouseId', as: 'movements' });

Movement.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Relaciones: CRM
Contact.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Contact, { foreignKey: 'customerId', as: 'contacts' });

Interaction.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Interaction, { foreignKey: 'customerId', as: 'interactions' });

Interaction.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Document.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Document, { foreignKey: 'customerId', as: 'documents' });

Document.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// Relaciones: Ventas
SalesOrder.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(SalesOrder, { foreignKey: 'customerId', as: 'orders' });

SalesOrder.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Invoice.belongsTo(SalesOrder, { foreignKey: 'orderId', as: 'order' });
SalesOrder.hasMany(Invoice, { foreignKey: 'orderId', as: 'invoices' });

Invoice.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Invoice, { foreignKey: 'customerId', as: 'invoices' });

Invoice.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });

Payment.belongsTo(User, { foreignKey: 'recordedBy', as: 'recorder' });

export {
  Product,
  Category,
  Warehouse,
  Stock,
  Movement,
  Customer,
  Contact,
  Interaction,
  Document,
  SalesOrder,
  Invoice,
  Payment,
  User,
};
