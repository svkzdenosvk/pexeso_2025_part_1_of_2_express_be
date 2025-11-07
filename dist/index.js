"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const login_1 = __importDefault(require("./routes/login"));
const registration_1 = __importDefault(require("./routes/registration"));
const logout_1 = __importDefault(require("./routes/logout"));
const authCheck_1 = __importDefault(require("./routes/authCheck"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// ---------- ✅ CORS middleware pre Vite frontend ----------
// app.use(
//   cors({
//     origin: process.env.NODE_ENV === 'production'
//       ? 'https://tvojadomena.sk'
//       : 'http://localhost:5173',
//     credentials: true,
//   })
// );
// https://vite-postgres.netlify.app/
app.use((0, cors_1.default)({
    // origin: 'http://localhost:4173', // FE adresa
    origin: 'https://vite-postgres.netlify.app/', // FE adresa
    credentials: true, // dôležité pre cookies!
}));
// ---------- Middlewares ----------
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// API routes
app.use('/api/register', registration_1.default);
app.use('/api', login_1.default);
app.use('/api', logout_1.default);
app.use('/api', authCheck_1.default);
// ---------- ✅ Debug cookies ----------
app.use((req, _res, next) => {
    console.log("Incoming cookies:", req.cookies);
    next();
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
