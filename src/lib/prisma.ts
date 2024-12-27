import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: [{ emit: "event", level: "query" }],
  });

// Log slow queries in development
if (process.env.NODE_ENV === "development") {
  (prisma.$on as any)("query", (e: any) => {
    if (e.duration >= 500) {
      // Only log queries slower than 500ms
      console.log(`Slow query (${e.duration}ms):`, {
        query: e.query,
        params: e.params,
      });
    }
  });
}

// Soft shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
