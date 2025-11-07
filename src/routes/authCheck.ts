import { Router } from "express";
import { prisma } from "../lib/prisma/prisma";
import {
  verifyShortToken,
  verifyLongToken,
  signShortToken,
} from "../lib/jwt/jwt_helper";
import { isLike_My_Type_User } from "../_inc/functions/general";

const router = Router();

router.get("/me", async (req, res) => {
  try {
    const shortToken = req.cookies["shortTerm_token"];
    const longToken = req.cookies["longTerm_token"];

    // 🟢 1. Skús validovať short-term token
    if (shortToken) {
      // try {
      const decodedShort: any = verifyShortToken(shortToken);
      if (decodedShort?.id) {
        console.log("existuje short token");

        const user = await prisma.users.findUnique({
          where: { id: decodedShort.id },
          select: { id: true, email: true, name: true },
        });
        if (user && isLike_My_Type_User(user)) {
          return res.json({ isLoggedIn: true, user });
        }
        // } catch (err) {
        // token expired → pokračuj nižšie
      }
    }

    // 🟠 2. Short-term token neplatný → skús long-term
    if (!longToken) {
      console.log("neexistuje long token");
      return res.status(401).json({ isLoggedIn: false });
    }

    const decodedLong = verifyLongToken(longToken);
    if (!decodedLong?.id) {
      console.log("decoded long token problem with id ");

      return res.status(401).json({ isLoggedIn: false });
    }

    // ---------- 3. Verify that the user still exists in the database (via Prisma)
    const user = await prisma.users.findUnique({
      where: { id: decodedLong.id },
      select: { id: true, email: true, name: true },
    });

    if (!user || !isLike_My_Type_User(user)) {
      console.log("problem s userom po prisme ");

      return res.status(401).json({ isLoggedIn: false });
    }

    // 🟣 3. Refreshni short-term token
    // const newShortToken = jwt.sign(
    //   { id: user.id, email: user.email },
    //   process.env.JWT_SECRET!,
    //   { expiresIn: "15m" }
    // );
    const newShortToken = signShortToken(user.id, user.email);

    res.cookie("shortTerm_token", newShortToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      // sameSite: "lax",
      sameSite: "none",
      path: "/",
      maxAge: 15 * 60, // 15 minutes in seconds
    });

    return res.json({ isLoggedIn: true, user });
  } catch (err) {
    console.error("Auth check error:", err);
    return res.status(500).json({ isLoggedIn: false });
  }
});

export default router;

// // src/routes/me.ts
// import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import { prisma } from '../lib/prisma/prisma'; // tvoj prisma client
// import { My_Type_Unique_User } from '@pexeso/_inc/my_types'; // typ užívateľa

// const router = Router();

// // GET /api/me
// router.get('/me', async (req, res) => {
//   try {
//     // 1️⃣ Načítaj token z cookies
//     const token = req.cookies['shortTerm_token'] || req.cookies['longTerm_token'];
//     // console.log("api/me co mi vracia",token)
//     // console.log('Cookies received:', req.cookies);

//     if (!token) return res.status(401).json({ isLoggedIn: false });

//     // 2️⃣ Over token pomocou JWT
//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
//     } catch (err) {
//       return res.status(401).json({ isLoggedIn: false });
//     }

//     // 3️⃣ Načítaj užívateľa z DB podľa ID
//     const user: My_Type_Unique_User | null = await prisma.users.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//       },
//     });

//     if (!user) return res.status(404).json({ isLoggedIn: false });

//     // 4️⃣ Vráť stav a údaje o užívateľovi
//     return res.json({ isLoggedIn: true, user });
//   } catch (err) {
//     console.error('Auth check error:', err);
//     return res.status(500).json({ isLoggedIn: false });
//   }
// });

// export default router;
