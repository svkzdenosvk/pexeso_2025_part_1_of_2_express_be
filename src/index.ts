/**
 * Express server entry point
 *
 * Purpose:
 *   - Initialize and configure the Express application.
 *   - Connect to the database via Prisma ORM.
 *   - Register global middleware (CORS, JSON parsing, cookies).
 *   - Define and mount API routes for authentication (login, register, logout, auth check).
 *
 * Workflow:
 *   1. Initialize Prisma (database connection).
 *   2. Create and configure Express app.
 *   3. Apply middleware in correct order.
 *   4. Mount REST API routes under `/api`.
 *   5. Handle invalid routes (404).
 *   6. Start HTTP server.
 *
 * Notes:
 *   - Uses `cookie-parser` for JWT cookies.
 */

import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// ---------- Route imports ----------
import loginRouter from './routes/login';
import registerRouter from './routes/registration';
import logoutRouter from './routes/logout';
import authCheckRouter from './routes/authCheck';


// 1. Initialize Prisma Client
let prisma: any;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  console.log('Prisma connected successfully!');
} catch (err) {
  console.error('Failed to initialize Prisma (DATABASE_URL missing or invalid).');
  console.error('Please set the DATABASE_URL environment variable (e.g., in Render).');
  console.error(err);
  process.exit(1); // Stop the app if DB is not available
}

// 2. Create Express Application
const app: Express = express();

// 3. Global Middleware

// ---------- Enable CORS for frontend communication ----------
app.use(
  cors({
    // origin: 'http://localhost:4173', // Local development
    origin: 'https://vite-postgres.netlify.app', // Production frontend
    credentials: true, // important for cookies!
  })
);

// ---------- Parse incoming JSON and cookies ----------
app.use(express.json());
app.use(cookieParser());


// ---------- Optional: Debug cookies middleware ----------
// app.use((req, _res, next) => {
//   console.log("Incoming cookies:", req.cookies);
//   next();
// });
  
//  Root Route (for health check)
app.get("/", (req, res) => {
  res.send("🚀 Express backend is running!");
});

// 4. API Routes (all under `/api`)
app.use('/api', registerRouter);
app.use('/api', loginRouter); 
app.use('/api', logoutRouter);
app.use('/api', authCheckRouter);

// 5. 404 Handler (unknown routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// 6. Start Server
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Express server started successfully! `);
  console.log(` URL: https://pexeso-2025-part-1-of-2-express-be.onrender.com `);
  console.log(` Port: ${PORT}`);
});
