import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: Record<string, PrismaClient> | undefined;
};

const dbUrl = process.env.DATABASE_URL;
const clientKey = dbUrl || 'default';

export const prisma = globalForPrisma.prisma?.[clientKey] ?? new PrismaClient();

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = {};
}

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma[clientKey] = prisma;
}