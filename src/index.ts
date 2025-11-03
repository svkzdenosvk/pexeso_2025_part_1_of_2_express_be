import express from "express";
import { prisma } from './lib/prisma/prisma';
import loginRouter from '@pexeso/routes/login';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', loginRouter); // /api/login bude dostupné


// app.get('/', async (_req, res) => {
//   const users = await prisma.users.findMany();
//   res.json(users);
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

