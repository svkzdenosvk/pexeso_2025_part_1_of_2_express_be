/**
 * Registration Route (POST /api/registration)
 *
 * Purpose:
 *   - Register a new user in the PostgreSQL database.
 *
 * Workflow:
 *   1. Extract and validate registration data from request body.
 *   2. Check if the email is already registered.
 *   3. Hash the password using bcrypt.
 *   4. Create a new user record via Prisma.
 *   5. Return user data (without password).
 */

import { Router } from "express";
import { prisma } from "../lib/prisma/prisma";
import bcrypt from "bcrypt";

const router = Router();

// POST /api/registration
router.post("/registration", async (req, res) => {
  try {
    // 1. Extract and validate registration data from request body
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ error: "missing_credentials" });
    }

    // 2. Check if the email is already registered
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "email_registered" });
    }

    // 3. Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user record via Prisma
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 5. Return user data (without password)
    return res.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "req_failed" });
  }
});

export default router;
