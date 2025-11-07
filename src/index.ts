import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import loginRouter from './routes/login';
import registerRouter from './routes/registration';
import logoutRouter from './routes/logout';
import authCheckRouter from './routes/authCheck';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ---------- ✅ CORS middleware pre Vite frontend ----------

// app.use(
//   cors({
//     origin: process.env.NODE_ENV === 'production'
//       ? 'https://tvojadomena.sk'
//       : 'http://localhost:5173',
//     credentials: true,
//   })
// );
// https://vite-postgres.netlify.app/
app.use(
  cors({
    // origin: 'http://localhost:4173', // FE adresa
    origin: 'https://vite-postgres.netlify.app/', // FE adresa
    credentials: true, // dôležité pre cookies!
  })
);

// ---------- Middlewares ----------
app.use(express.json());
app.use(cookieParser());

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
