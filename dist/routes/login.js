"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = require("express");
const prisma_1 = require("../lib/prisma/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_helper_1 = require("../lib/jwt/jwt_helper");
// import { verifyApiOrigin } from '@pexeso/_inc/functions/originValidation';
const router = (0, express_1.Router)();
// POST /api/login
router.post('/login', async (req, res) => {
    try {
        // 1️⃣ CORS / anti-CSRF check
        // const origin = req.headers.origin?? null;
        // if (!verifyApiOrigin(origin)) {
        //   console.warn('Blocked origin:', origin);
        //   return res.status(403).json({ error: 'not_allowed_origin' });
        // }
        // 2️⃣ Parse credentials from body
        const { email, password } = req.body;
        // 3️⃣ Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'missing_credentials' });
        }
        // 4️⃣ Find user in PostgreSQL via Prisma
        const user = await prisma_1.prisma.users.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: 'invalid_credentials' });
        // 5️⃣ Compare password
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword)
            return res.status(401).json({ error: 'invalid_credentials' });
        // 6️⃣ Generate JWT tokens
        const shortToken = (0, jwt_helper_1.signShortToken)(user.id, user.email);
        const longToken = (0, jwt_helper_1.signLongToken)(user.id);
        // 7️⃣ Set cookies (HTTP-only)
        res.cookie('shortTerm_token', shortToken, {
            httpOnly: true,
            secure: false, // pri localhoste false
            sameSite: 'none', // <- toto je kľúčové
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15 min in ms
            path: '/',
        });
        res.cookie('longTerm_token', longToken, {
            httpOnly: true,
            secure: false, // pri localhoste false
            sameSite: 'none', // <- toto je kľúčové
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
            path: '/',
        });
        // 8️⃣ Return user data
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'unknown_err' });
    }
});
exports.default = router;
