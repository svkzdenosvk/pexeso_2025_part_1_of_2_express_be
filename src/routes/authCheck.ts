/**
 * Auth Check Route (GET /api/me)
 *
 * Purpose:
 *   - Verify if a user is currently authenticated.
 *   - Validate short-term and long-term JWT cookies.
 *
 * Workflow:
 *   1. Attempt to verify short-term token.
 *   2. If invalid or missing, verify long-term token.
 *   3. Ensure the user still exists in the database.
 *   4. Refresh short-term token if long-term token is valid.
 *   5. Return user info or authentication status.
 */

import { Router } from "express";
import { prisma } from "../lib/prisma/prisma";
import {
  verifyShortToken,
  verifyLongToken,
  signShortToken,
} from "../lib/jwt/jwt_helper";
import { isLike_My_Type_User } from "../_inc/functions/general";

const router = Router();

// GET /api/me
router.get("/me", async (req, res) => {
  try {
    // 1. Extract tokens from cookies
    const shortToken = req.cookies["shortTerm_token"];
    const longToken = req.cookies["longTerm_token"];

    // 2. Attempt to verify short-term token
    if (shortToken) {
      const decodedShort: any = verifyShortToken(shortToken);
      if (decodedShort?.id) {
        const user = await prisma.users.findUnique({
          where: { id: decodedShort.id },
          select: { id: true, email: true, name: true },
        });

        if (user && isLike_My_Type_User(user)) {
          return res.json({ isLoggedIn: true, user });
        }
      }
    } // else token expired or not exists

    // 3. Fallback: validate long-term token
    if (!longToken) {
      return res.status(401).json({ isLoggedIn: false });
    }

    const decodedLong = verifyLongToken(longToken);
    if (!decodedLong?.id) {
      console.log("decoded long token has problem with id ");

      return res.status(401).json({ isLoggedIn: false });
    }

    // 4. Confirm that user still exists in database
    const user = await prisma.users.findUnique({
      where: { id: decodedLong.id },
      select: { id: true, email: true, name: true },
    });

    if (!user || !isLike_My_Type_User(user)) {
      console.log("problem s userom po prisme ");

      return res.status(401).json({ isLoggedIn: false });
    }

    // 5. Refresh short-term token and set new cookie
    const newShortToken = signShortToken(user.id, user.email);

    res.cookie("shortTerm_token", newShortToken, {
      httpOnly: true,
      secure: true, // set to false for localhost if needed
      sameSite: "none",
      path: "/",
      maxAge: 15 * 60 * 1000, // 15 minutes in miliseconds
    });

    // 6. Return authenticated user
    return res.json({ isLoggedIn: true, user });
  } catch (err) {
    console.error("Auth check error:", err);
    return res.status(500).json({ isLoggedIn: false });
  }
});

export default router;
