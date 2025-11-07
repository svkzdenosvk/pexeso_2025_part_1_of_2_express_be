"use strict";
/**
 * Origin validation functions
 *
 * Provides both frontend and backend helpers for validating request origins.
 *
 * Purpose:
 *   - Prevent unauthorized cross-origin requests.
 *   - Ensure requests come only from trusted domains.
 *
 * Usage:
 *   - verifyClientOrigin() → Checks browser's window.origin against allowed list.
 *   - verifyApiOrigin()    → Checks API request 'origin' header against allowed list.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyApiOrigin = exports.verifyClientOrigin = exports.ALLOWED_ORIGINS = void 0;
/**
 * List of allowed origins (domains) from which POST requests can be accepted.
 * This is used both in the frontend and backend for security checks.
 */
exports.ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://pexeso-next.netlify.app',
];
/**
 * Frontend origin verification.
 * Checks whether the current browser origin is in the allowed list.
 *
 * @returns True if the origin is allowed, otherwise false.
 */
const verifyClientOrigin = () => {
    if (typeof window === 'undefined')
        return true; // Allow during SSR (Server-Side Rendering)
    const currentOrigin = window.location.origin;
    const isValid = exports.ALLOWED_ORIGINS.includes(currentOrigin);
    if (!isValid) {
        console.error(`Invalid origin: ${currentOrigin}`);
    }
    return isValid;
};
exports.verifyClientOrigin = verifyClientOrigin;
/*--------------------------------------------------------------------------*/
/**
 * Backend (API) origin verification.
 * Checks if the provided origin header is in the allowed list.
 *
 * @param origin - The request origin (or null if not provided).
 * @returns True if the origin is allowed, otherwise false.
 */
const verifyApiOrigin = (origin) => {
    if (!origin)
        return false;
    const isValid = exports.ALLOWED_ORIGINS.includes(origin);
    return isValid;
};
exports.verifyApiOrigin = verifyApiOrigin;
