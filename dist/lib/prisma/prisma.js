"use strict";
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// //  import { PrismaClient } from '../../generated/prisma';
// import { PrismaClient } from '@prisma/client';
// /**
//  * Prisma Client Initialization
//  * ----------------------------------------------------------
//  * This module configures and exports a single Prisma client
//  * instance to interact with the PostgreSQL database.
//  *
//  * Features:
//  *  • Prevents multiple Prisma instances during development
//  *  • Enables query logging for debugging
//  *  • Uses generated Prisma client types
//  *
//  * Dependencies:
//  *  • Prisma ORM
//  */
// // Reuse Prisma client to avoid creating multiple instances in dev
// declare global {
//   var prisma: PrismaClient | undefined;
// }
// // Create a single Prisma client instance or reuse an existing one
// export const prisma =
//   global.prisma ||
//   new PrismaClient({
//     //  log: ['query'], // Log all queries in terminal (useful during development)
//     //  log: process.env.NODE_ENV === 'development' ? ['warn','error'] : [],
//   });
// // Prevent multiple client instances in dev environment
// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
// import { PrismaClient } from '../../generated/prisma';
const prisma_1 = require("../../../generated/prisma");
exports.prisma = globalThis.prisma ||
    new prisma_1.PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['query','warn','error'] : [],
    });
if (process.env.NODE_ENV !== "production")
    globalThis.prisma = exports.prisma;
