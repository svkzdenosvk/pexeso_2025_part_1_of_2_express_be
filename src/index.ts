import express from "express";
import type { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import loginRouter from './routes/login';
import registerRouter from './routes/registration';
import logoutRouter from './routes/logout';
import authCheckRouter from './routes/authCheck';

const app: Express = express();
// const PORT = process.env.PORT || 3000;

app.use(express.json());

// === TOTO JE NOVÉ – pridaj toto hore ===
let prisma: any;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  console.log('✅ Prisma connected!');
} catch (err) {
  console.error('DATABASE_URL chýba alebo je zlé! Appka padá.');
  console.error('Nastav env premennú DATABASE_URL na Rendri!');
  console.error(err);
  process.exit(1); // <-- toto nám konečne ukáže chybu v logu
}
// ========================================

// ---------- ✅ CORS middleware pre Vite frontend ----------


app.use(
  cors({
    // origin: 'http://localhost:4173', // FE adresa
    origin: 'https://vite-postgres.netlify.app', // FE adresa
    credentials: true, // dôležité pre cookies!
  })
);

// ---------- Middlewares ----------
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("🚀 Express backend is running!");
});


// API routes
app.use('/api/register', registerRouter);
app.use('/api', loginRouter); 
app.use('/api', logoutRouter);
app.use('/api', authCheckRouter);

// ---------- ✅ Debug cookies ----------
app.use((req, _res, next) => {
  console.log("Incoming cookies:", req.cookies);
  next();
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
