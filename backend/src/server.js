import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

import { connectDB, disconnectDB } from './config/db.js';
import { seedDatabase } from './utils/seeder.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === 'production';

// 1. HTTP Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows image loading from /uploads across origins
    contentSecurityPolicy: isProduction ? undefined : false,
  })
);

// 2. HTTP Payload Compression
app.use(compression());

// 3. HTTP Request Logging
app.use(morgan(isProduction ? 'combined' : 'dev'));

// 4. Rate Limiting (DDoS & Brute-force protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 auth requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 5. Configurable CORS
const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, server-to-server, curl)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        !isProduction // In local dev, be permissive for convenience
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not permitted by CORS policy`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Ensure uploads directory exists and serve statically
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// 7. Production Health & Readiness Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    message: 'PakProperty API is operational',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// 8. Mount Domain API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 9. Centralized Error Handler
app.use(errorHandler);

// 10. Server Initialization and Graceful Shutdown
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed demo database if requested or in development
    const shouldSeed = process.env.SEED_ON_START === 'true' || !isProduction;
    if (shouldSeed) {
      await seedDatabase(false);
    }

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` PakProperty Backend API running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('MongoDB connection closed. Server process exited cleanly.');
        process.exit(0);
      });
      // Force exit if close takes longer than 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
