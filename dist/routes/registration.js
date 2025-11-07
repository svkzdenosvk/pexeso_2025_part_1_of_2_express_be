"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const originValidation_1 = require("../_inc/functions/originValidation");
const router = (0, express_1.Router)();
// POST /api/register
router.post('/register', async (req, res) => {
    try {
        // 1️⃣ CORS / anti-CSRF check
        const origin = req.headers.origin || null;
        if (!(0, originValidation_1.verifyApiOrigin)(origin)) {
            return res.status(403).json({ error: 'not_allowed_origin' });
        }
        // 2️⃣ Parse request body
        const { name, email, password } = req.body;
        // 3️⃣ Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'missing_credentials' });
        }
        // 4️⃣ Check if user already exists
        const existingUser = await prisma_1.prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'email_registered' });
        }
        // 5️⃣ Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // 6️⃣ Create user in PostgreSQL via Prisma
        const newUser = await prisma_1.prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        // 7️⃣ Return success and user info (without password)
        return res.json({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'req_failed' });
    }
});
exports.default = router;
