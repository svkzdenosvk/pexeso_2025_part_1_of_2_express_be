import jwt /*, { SignOptions }*/ from "jsonwebtoken";
import type { My_Type_Unique_User } from "../../_inc/my_types";

/*
 * 🔐 JWT Helper Utilities
 *
 * This module handles creation and verification of JWT tokens
 * used for authenticating users in the application.
 *
 * Workflow:
 *   1. Load JWT secrets and expiration times from environment variables.
 *   2. signShortToken(id, email) → creates a short-lived token for authentication.
 *   3. signLongToken(id) → creates a long-lived refresh token.
 *   4. verifyShortToken(token) → verifies and decodes short-lived token.
 *   5. verifyLongToken(token) → verifies and decodes long-lived token.
 *
 * Dependencies:
 *  • jsonwebtoken
 */

// Duration strings for JWT expiration
type MsString = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`; // napr. 15m, 7d, 2h

// ---------- Load environment variables ----------
const JWT_SHORT_SECRET = process.env.JWT_SHORT_SECRET!;
const JWT_LONG_SECRET = process.env.JWT_LONG_SECRET as string;
const JWT_SHORT_EXPIRES_IN: MsString =
  (process.env.JWT_SHORT_IN as MsString) || "15m";
const JWT_LONG_EXPIRES_IN: MsString =
  (process.env.JWT_LONG_EXPIRES_IN as MsString) || "7d";

// ---------- Token Signers ----------

// Create short-lived access token for a user
export function signShortToken(id: number, email: string): string {
  const payload: My_Type_Unique_User = { id, email };

  return jwt.sign(payload, JWT_SHORT_SECRET, {
    expiresIn: JWT_SHORT_EXPIRES_IN,
  });
}

// Create long-lived refresh token for a user
export function signLongToken(id: number): string {
  return jwt.sign({ id }, JWT_LONG_SECRET, { expiresIn: JWT_LONG_EXPIRES_IN });
}

// ---------- Token Verifiers ----------

/** Verify and decode short-lived access token */
export function verifyShortToken(token: string) {
  try {
    return jwt.verify(token, JWT_SHORT_SECRET) as My_Type_Unique_User;
  } catch {
    return null;
  }
}

/** Verify and decode long-lived refresh token */
export function verifyLongToken(token: string) {
  try {
    return jwt.verify(token, JWT_LONG_SECRET) as { id: number };
  } catch {
    return null;
  }
}
