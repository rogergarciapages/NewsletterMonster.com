import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  // Add query performance monitoring
  prisma.$use(async (params, next) => {
    const start = performance.now();
    const result = await next(params);
    const end = performance.now();

    if (end - start > 100) {
      console.warn(`Slow query detected (${Math.round(end - start)}ms):`, {
        model: params.model,
        operation: params.action,
        args: params.args,
      });
    }

    return result;
  });

  return prisma;
};

// Check if we already have an instance of Prisma Client
if (!global.prisma) {
  global.prisma = prismaClientSingleton();
}

const prisma = global.prisma;

export default prisma;
