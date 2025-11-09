import { Router } from "express";

const router = Router();

// GET /api/logout
router.get("/logout", (_req, res) => {
  
  // Delete cookie "shortTerm_token" and "longTerm_token"
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("shortTerm_token", {
    httpOnly: true,
    secure: true,
    sameSite:  "none",
    path: "/", 
  });

  res.clearCookie("longTerm_token", {
    httpOnly: true,
    secure: true,
    sameSite:  "none",
    path: "/", 
  });

  return res.json({ success: true });
});

export default router;
