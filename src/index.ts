import express from "express";
// import { prisma } from './lib/prisma/prisma';
import loginRouter from '@pexeso/routes/login';
import registerRouter from '@pexeso/routes/registration';
import logoutRouter from './routes/logout';
import authCheckRouter from '@pexeso/routes/authCheck';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.use('/api/register', registerRouter);
app.use('/api', loginRouter); 
app.use('/api', logoutRouter);
app.use('/api', authCheckRouter);

// app.get('/', async (_req, res) => {
//   const users = await prisma.users.findMany();
//   res.json(users);
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

