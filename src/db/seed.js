import sequelize from '../config/database.js';
import {
  User,
  Product,
  Category,
  Warehouse,
  Stock,
  Customer,
  Contact,
  SalesOrder,
  Invoice,
} from '../models/index.js';
import bcryptjs from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // Sincronizar tablas
    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas');

    // Crear usuarios
    const adminPassword = await bcryptjs.hash('Admin123!@', 10);
    const userPassword = await bcryptjs.hash('User123!@', 10);

    const admin = await User.create({
      email: 'admin@maggudi.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: 'admin',
    });

    const manager = await User.create({
      email: 'manager@maggudi.com',
      password: userPassword,
      firstName: 'Gerente',
      lastName: 'Ventas',
      role: 'manager',
    });

    const user = await User.create({
      email: 'user@maggudi.com',
      password: userPassword,
      firstName: 'Usuario',
      lastName: 'Normal',
      role: 'user',
    });

    console.log('✅ Usuarios creados');

    // Crear categorías
    const electronicsCategory = await Category.create({
      name: 'Electrónica',
      description: 'Productos electrónicos en general',
    });

    const mobileCategory = await Category.create({
      name: 'Móviles',
      description: 'Teléfonos y accesorios',
    });

    const computerCategory = await Category.create({
      name: 'Computadoras',
      description: 'Laptops y componentes',
    });

    console.log('✅ Categorías creadas');

    // Crear productos
    const products = await Promise.all([
      Product.create({
        name: 'iPhone 14 Pro',
        description: 'Teléfono premium de Apple',
        price: 999.99,
        cost: 600.00,
        categoryId: mobileCategory.id,
        sku: 'IP14P-001',
        barcode: '1234567890123',
      }),
      Product.create({
        name: 'Samsung Galaxy S23',
        description: 'Teléfono flagship de Samsung',
        price: 899.99,
        cost: 550.00,
        categoryId: mobileCategory.id,
        sku: 'SGS23-001',
        barcode: '1234567890124',
      }),
      Product.create({
        name: 'MacBook Pro 14"',
        description: 'Laptop profesional de Apple',
        price: 1999.99,
        cost: 1200.00,
        categoryId: computerCategory.id,
        sku: 'MBP14-001',
        barcode: '1234567890125',
      }),
      Product.create({
        name: 'Dell XPS 13',
        description: 'Laptop ultraportátil',
        price: 1299.99,
        cost: 800.00,
        categoryId: computerCategory.id,
        sku: 'DXPS13-001',
        barcode: '1234567890126',
      }),
    ]);

    console.log('✅ Productos creados');

    // Crear almacenes
    const warehouse1 = await Warehouse.create({
      name: 'Almacén Central',
      location: 'Bogotá, Colombia',
      capacity: 10000,
    });

    const warehouse2 = await Warehouse.create({
      name: 'Almacén Regional',
      location: 'Medellín, Colombia',
      capacity: 5000,
    });

    console.log('✅ Almacenes creados');

    // Crear stock
    await Promise.all([
      Stock.create({
        productId: products[0].id,
        warehouseId: warehouse1.id,
        quantity: 50,
        minimumQuantity: 10,
        maximumQuantity: 200,
      }),
      Stock.create({
        productId: products[1].id,
        warehouseId: warehouse1.id,
        quantity: 40,
        minimumQuantity: 10,
        maximumQuantity: 150,
      }),
      Stock.create({
        productId: products[2].id,
        warehouseId: warehouse2.id,
        quantity: 25,
        minimumQuantity: 5,
        maximumQuantity: 100,
      }),
      Stock.create({
        productId: products[3].id,
        warehouseId: warehouse2.id,
        quantity: 30,
        minimumQuantity: 5,
        maximumQuantity: 100,
      }),
    ]);

    console.log('✅ Stock creado');

    // Crear clientes
    const customers = await Promise.all([
      Customer.create({
        name: 'Empresa XYZ S.A.',
        email: 'contacto@xyzsa.com',
        phone: '+57 310 1234567',
        address: 'Calle 10 #20-30',
        city: 'Bogotá',
        state: 'Cundinamarca',
        country: 'Colombia',
        taxId: '800123456-7',
        status: 'customer',
      }),
      Customer.create({
        name: 'Tienda ABC Ltda.',
        email: 'info@tiendaabc.com',
        phone: '+57 310 2345678',
        address: 'Carrera 5 #15-45',
        city: 'Medellín',
        state: 'Antioquia',
        country: 'Colombia',
        taxId: '800234567-8',
        status: 'customer',
      }),
      Customer.create({
        name: 'Distribuidor Global',
        email: 'ventas@distribuidor.com',
        phone: '+57 310 3456789',
        address: 'Avenida Siempre Viva 123',
        city: 'Cali',
        state: 'Valle del Cauca',
        country: 'Colombia',
        taxId: '800345678-9',
        status: 'prospect',
      }),
    ]);

    console.log('✅ Clientes creados');

    // Crear contactos
    await Promise.all([
      Contact.create({
        customerId: customers[0].id,
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@xyzsa.com',
        phone: '+57 310 1111111',
        position: 'Gerente de Compras',
        isPrimary: true,
      }),
      Contact.create({
        customerId: customers[1].id,
        firstName: 'María',
        lastName: 'López',
        email: 'maria@tiendaabc.com',
        phone: '+57 310 2222222',
        position: 'Administrador',
        isPrimary: true,
      }),
    ]);

    console.log('✅ Contactos creados');

    // Crear órdenes de venta
    const order1 = await SalesOrder.create({
      customerId: customers[0].id,
      orderNumber: `ORD-${Date.now()}`,
      orderDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: [
        {
          productId: products[0].id,
          quantity: 5,
          unitPrice: 999.99,
        },
        {
          productId: products[2].id,
          quantity: 2,
          unitPrice: 1999.99,
        },
      ],
      subtotal: 5999.95,
      tax: 1199.99,
      total: 7199.94,
      status: 'confirmed',
      createdBy: manager.id,
    });

    console.log('✅ Órdenes de venta creadas');

    // Crear factura
    const invoice = await Invoice.create({
      orderId: order1.id,
      customerId: customers[0].id,
      invoiceNumber: `INV-2024-001`,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: order1.items,
      subtotal: order1.subtotal,
      tax: order1.tax,
      total: order1.total,
      status: 'sent',
      sentDate: new Date(),
      createdBy: manager.id,
    });

    console.log('✅ Facturas creadas');

    console.log('\n✅ 🌱 Seed completado exitosamente!');
    console.log('\n📋 Datos de prueba:');
    console.log('\nUsuarios:');
    console.log('  Admin: admin@maggudi.com / Admin123!@');
    console.log('  Manager: manager@maggudi.com / User123!@');
    console.log('  User: user@maggudi.com / User123!@');
    console.log('\n📦 Productos: 4');
    console.log('🏭 Almacenes: 2');
    console.log('👥 Clientes: 3');
    console.log('🛍️ Órdenes: 1');
    console.log('🧾 Facturas: 1\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante seed:', error);
    process.exit(1);
  }
};

seedDatabase();
