/**
 * Login Route (POST /api/login)
 *
 * Purpose:
 *   - Authenticate a user using email and password.
 *   - Verify credentials against the PostgreSQL database via Prisma.
 *   - On success, generate and send short-term and long-term JWT cookies.
 *
 * Workflow:
 *   1. Parse and validate credentials from request body.
 *   2. Look up the user in the database.
 *   3. Verify password using bcrypt.
 *   4. Generate JWT tokens (short + long).
 *   5. Set HTTP-only cookies.
 *   6. Return basic user data.
 *
 * Notes:
 *   - Passwords are hashed using bcrypt.
 **/

import { Router } from "express";
import { prisma } from "../lib/prisma/prisma";
import bcrypt from "bcrypt";
import { signShortToken, signLongToken } from "../lib/jwt/jwt_helper";

const router = Router();

// POST /api/login
router.post("/login", async (req, res) => {
  try {
   
    // 1. Extract credentials from request body
    const { email, password } = req.body as { email: string; password: string };

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ error: "missing_credentials" });
    }

    // 2. Find user in PostgreSQL via Prisma
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    // 3. Compare hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "invalid_credentials" });

    // 4. Generate JWT tokens
    const shortToken = signShortToken(user.id, user.email);
    const longToken = signLongToken(user.id);

    // 5. Set authentication cookies
    res.cookie("shortTerm_token", shortToken, {
      httpOnly: true,
      secure: true, // set to false in localhost
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 min in ms
      path: "/",
    });

    res.cookie("longTerm_token", longToken, {
      httpOnly: true,
      secure: true, // for localhost false
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      path: "/",
    });

    // 6. Return user data
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "unknown_err" });
  }
});

export default router;
