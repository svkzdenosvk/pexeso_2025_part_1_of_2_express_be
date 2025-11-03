// src/routes/me.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma/prisma'; // tvoj prisma client
import { My_Type_Unique_User } from '@pexeso/_inc/my_types'; // typ užívateľa

const router = Router();

// GET /api/me
router.get('/me', async (req, res) => {
  try {
    // 1️⃣ Načítaj token z cookies
    const token = req.cookies['shortTerm_token'] || req.cookies['longTerm_token'];
    if (!token) return res.status(401).json({ isLoggedIn: false });

    // 2️⃣ Over token pomocou JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    } catch (err) {
      return res.status(401).json({ isLoggedIn: false });
    }

    // 3️⃣ Načítaj užívateľa z DB podľa ID
    const user: My_Type_Unique_User | null = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) return res.status(404).json({ isLoggedIn: false });

    // 4️⃣ Vráť stav a údaje o užívateľovi
    return res.json({ isLoggedIn: true, user });
  } catch (err) {
    console.error('Auth check error:', err);
    return res.status(500).json({ isLoggedIn: false });
  }
});

export default router;
