import { Router } from 'express';

const router = Router();

// GET /api/logout
router.get('/logout', (_req, res) => {

  // Delete cookie "shortTerm_token" a "longTerm_token"

  res.clearCookie('shortTerm_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.clearCookie('longTerm_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.json({ success: true });
});

export default router;
