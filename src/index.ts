import * as express from "express";
import { prisma } from './lib/prisma';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (_req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

