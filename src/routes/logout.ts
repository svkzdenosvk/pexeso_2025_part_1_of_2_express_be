/**
 * Logout Route (GET /api/logout)
 *
 * Purpose:
 *   - Log out the currently authenticated user.
 *   - Clear authentication cookies from the client (short-term and long-term tokens).
 *
 * Workflow:
 *   1. Remove JWT cookies from the response.
 *   2. Confirm logout success with a JSON response.
 */

import { Router } from "express";

const router = Router();

// GET /api/logout
router.get("/logout", (_req, res) => {
  // 1. Remove authentication cookies

  res.clearCookie("shortTerm_token", {
    httpOnly: true,
    secure: true, // set to false for localhost if needed
    sameSite: "none",
    path: "/",
  });

  res.clearCookie("longTerm_token", {
    httpOnly: true,
    secure: true, // set to false for localhost if needed
    sameSite: "none",
    path: "/",
  });

  // 2. Confirm logout success
  return res.json({ success: true });
});

export default router;
