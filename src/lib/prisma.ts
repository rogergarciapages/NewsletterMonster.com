// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL,
      },
    },
    log: ["error", "warn"],
  });

  // Add performance monitoring
  client.$use(async (params, next) => {
    const start = performance.now();
    try {
      const result = await next(params);
      const end = performance.now();
      const time = end - start;

      if (time > 1000) {
        console.warn(`Slow query warning: ${params.model}.${params.action} took ${time}ms`);
      }

      return result;
    } catch (error) {
      const end = performance.now();
      console.error(
        `Query error: ${params.model}.${params.action} failed after ${end - start}ms`,
        error
      );
      throw error;
    }
  });

  return client;
};

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaClientSingleton();
  }
  return globalForPrisma.prisma;
}

const prisma = getPrismaClient();

if (!prisma) {
  throw new Error("Failed to initialize Prisma client");
}

export { prisma };
