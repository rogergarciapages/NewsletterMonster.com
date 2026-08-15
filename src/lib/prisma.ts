import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://postgres:Bpx2fQWrVxEyAat9UokmNd9bzKKqhfFv@supabasenewsletter.oncewerehumans.com:5432/postgres?schema=public";

const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: [{ emit: "event", level: "query" }],
  });

// Log slow queries in development
if (process.env.NODE_ENV === "development") {
  (prisma.$on as any)("query", (e: any) => {
    if (e.duration >= 500) {
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
