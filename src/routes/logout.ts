import { Router } from "express";

const router = Router();

// GET /api/logout
router.get("/logout", (_req, res) => {
  // Delete cookie "shortTerm_token" a "longTerm_token"

  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("shortTerm_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "lax" : "none",
    path: "/", // musí byť rovnaké
  });

  res.clearCookie("longTerm_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "lax" : "none",
    path: "/", // rovnaké
  });

  console.log("bolo odhlaseny clovek z expresu");
  return res.json({ success: true });
});

export default router;
