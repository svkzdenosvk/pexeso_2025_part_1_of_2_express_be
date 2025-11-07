"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma/prisma");
const jwt_helper_1 = require("../lib/jwt/jwt_helper");
// import { My_Type_Unique_User } from "@pexeso/_inc/my_types";
const general_1 = require("../_inc/functions/general");
const router = (0, express_1.Router)();
router.get("/me", async (req, res) => {
    try {
        const shortToken = req.cookies["shortTerm_token"];
        const longToken = req.cookies["longTerm_token"];
        // 🟢 1. Skús validovať short-term token
        if (shortToken) {
            // try {
            const decodedShort = (0, jwt_helper_1.verifyShortToken)(shortToken);
            if (decodedShort?.id) {
                const user = await prisma_1.prisma.users.findUnique({
                    where: { id: decodedShort.id },
                    select: { id: true, email: true, name: true },
                });
                if (user && (0, general_1.isLike_My_Type_User)(user)) {
                    return res.json({ isLoggedIn: true, user });
                }
                // } catch (err) {
                // token expired → pokračuj nižšie
            }
        }
        // 🟠 2. Short-term token neplatný → skús long-term
        if (!longToken)
            return res.status(401).json({ isLoggedIn: false });
        const decodedLong = (0, jwt_helper_1.verifyLongToken)(longToken);
        if (!decodedLong?.id) {
            return res.status(401).json({ isLoggedIn: false });
        }
        // ---------- 3. Verify that the user still exists in the database (via Prisma)
        const user = await prisma_1.prisma.users.findUnique({
            where: { id: decodedLong.id },
            select: { id: true, email: true, name: true },
        });
        if (!user || !(0, general_1.isLike_My_Type_User)(user)) {
            return res.status(401).json({ isLoggedIn: false });
        }
        // 🟣 3. Refreshni short-term token
        // const newShortToken = jwt.sign(
        //   { id: user.id, email: user.email },
        //   process.env.JWT_SECRET!,
        //   { expiresIn: "15m" }
        // );
        const newShortToken = (0, jwt_helper_1.signShortToken)(user.id, user.email);
        res.cookie("shortTerm_token", newShortToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60 // 15 minutes in seconds
        });
        return res.json({ isLoggedIn: true, user });
    }
    catch (err) {
        console.error("Auth check error:", err);
        return res.status(500).json({ isLoggedIn: false });
    }
});
exports.default = router;
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
