import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import sequelize from './config/database.js';
import './config/passport.js';
import authRoutes from './api/routes/authRoutes.js';
import userRoutes from './api/routes/userRoutes.js';
import inventoryRoutes from './api/routes/inventoryRoutes.js';
import crmRoutes from './api/routes/crmRoutes.js';
import salesRoutes from './api/routes/salesRoutes.js';
import buyingRoutes from './api/routes/buyingRoutes.js';
import hrRoutes from './api/routes/hrRoutes.js';
import accountingRoutes from './api/routes/accountingRoutes.js';
import paymentRoutes from './api/routes/paymentRoutes.js';
import './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Configurar sesión
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/buying', buyingRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

sequelize.sync().then(() => {
  console.log('✅ Base de datos sincronizada');
}).catch((error) => {
  console.error('❌ Error sincronizando BD:', error);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
