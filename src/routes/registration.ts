import { Router } from 'express';
import { prisma } from '../lib/prisma/prisma';
import bcrypt from 'bcrypt';
import { verifyApiOrigin } from '../_inc/functions/originValidation';

const router = Router();

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    // 1️⃣ CORS / anti-CSRF check
    const origin = req.headers.origin || null;
    if (!verifyApiOrigin(origin)) {
      return res.status(403).json({ error: 'not_allowed_origin' });
    }

    // 2️⃣ Parse request body
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    // 3️⃣ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'missing_credentials' });
    }

    // 4️⃣ Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'email_registered' });
    }

    // 5️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Create user in PostgreSQL via Prisma
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 7️⃣ Return success and user info (without password)
    return res.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'req_failed' });
  }
});

export default router;
