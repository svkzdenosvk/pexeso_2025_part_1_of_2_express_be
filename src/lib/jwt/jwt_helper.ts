import jwt /*, { SignOptions }*/ from "jsonwebtoken";
import type { My_Type_Unique_User } from "../../_inc/my_types";

//  * 🔐 JWT Helper Utilities
//  * ----------------------------------------------------------
//  * This module handles creation and verification of JWT tokens
//  * used for authenticating users in the application.
//  *
//  * Functions:
//  *  • signToken() → Creates a signed JWT for a given user
//  *  • verifyToken() → Validates and decodes an existing token
//  *
//  * Required environment variables:
//  *  • JWT_SECRET="your_secret_key"
//  *  • JWT_EXPIRES_IN="7d"   (optional, default 7 days)
//  *
//  * Dependencies:
//  *  • jsonwebtoken
//  */
type MsString = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`; // napr. 15m, 7d, 2h

// Load environment variables
const JWT_SHORT_SECRET = process.env.JWT_SHORT_SECRET!;
const JWT_LONG_SECRET = process.env.JWT_LONG_SECRET as string;
const JWT_SHORT_EXPIRES_IN: MsString =
  (process.env.JWT_SHORT_IN as MsString) || "15m";
const JWT_LONG_EXPIRES_IN: MsString =
  (process.env.JWT_LONG_EXPIRES_IN as MsString) || "7d";

/** Create short-lived access token */
export function signShortToken(id: number, email: string): string {
  const payload: My_Type_Unique_User = { id, email };

  return jwt.sign(payload, JWT_SHORT_SECRET, {
    expiresIn: JWT_SHORT_EXPIRES_IN,
  });
}

/** Create long-lived refresh token */
export function signLongToken(id: number): string {
  return jwt.sign({ id }, JWT_LONG_SECRET, { expiresIn: JWT_LONG_EXPIRES_IN });
}

/** Verify access token */
export function verifyShortToken(token: string) {
  try {
    return jwt.verify(token, JWT_SHORT_SECRET) as My_Type_Unique_User;
  } catch {
    return null;
  }
}

/** Verify refresh token */
export function verifyLongToken(token: string) {
  try {
    return jwt.verify(token, JWT_LONG_SECRET) as { id: number };
  } catch {
    return null;
  }
}
