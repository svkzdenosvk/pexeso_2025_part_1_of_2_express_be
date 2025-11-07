"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signShortToken = signShortToken;
exports.signLongToken = signLongToken;
exports.verifyShortToken = verifyShortToken;
exports.verifyLongToken = verifyLongToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Load environment variables
const JWT_SHORT_SECRET = process.env.JWT_SHORT_SECRET;
const JWT_LONG_SECRET = process.env.JWT_LONG_SECRET;
const JWT_SHORT_EXPIRES_IN = process.env.JWT_SHORT_IN || "15m";
const JWT_LONG_EXPIRES_IN = process.env.JWT_LONG_EXPIRES_IN || "7d";
/** Create short-lived access token */
function signShortToken(id, email) {
    const payload = { id, email };
    return jsonwebtoken_1.default.sign(payload, JWT_SHORT_SECRET, {
        expiresIn: JWT_SHORT_EXPIRES_IN,
    });
}
/** Create long-lived refresh token */
function signLongToken(id) {
    return jsonwebtoken_1.default.sign({ id }, JWT_LONG_SECRET, { expiresIn: JWT_LONG_EXPIRES_IN });
}
/** Verify access token */
function verifyShortToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SHORT_SECRET);
    }
    catch {
        return null;
    }
}
/** Verify refresh token */
function verifyLongToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_LONG_SECRET);
    }
    catch {
        return null;
    }
}
