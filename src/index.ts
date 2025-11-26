import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import appointmentStatusRoutes from './routes/appointmentStatusRoutes';
import paymentMethodsRoutes from './routes/paymentMethodsRoutes';
import rolesRoutes from './routes/rolesRoutes';
import provincesRoutes from './routes/provincesRoutes';
import cantonsRoutes from './routes/cantonsRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import pool from './config/database';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/appointment-status', appointmentStatusRoutes);
app.use('/api/payment-methods', paymentMethodsRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/provinces', provincesRoutes);
app.use('/api/cantons', cantonsRoutes);

// Ruta de salud
app.get('/health', async (_req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.status(200).json({
      success: true,
      message: 'Servidor y base de datos funcionando correctamente',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Error de conexión con la base de datos',
    });
  }
});

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

