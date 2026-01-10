import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { // globalThis is a JavaScript global object (exists across the entire app)
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient(); // create prisma client if not exists

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;