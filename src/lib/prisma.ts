import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://postgres:Bpx2fQWrVxEyAat9UokmNd9bzKKqhfFv@supabase-db:5432/postgres?schema=public";

// Safely convert public domain port 5432 to internal Docker container network hostname when running in server container
if (dbUrl.includes("supabasenewsletter.oncewerehumans.com:5432")) {
  dbUrl = dbUrl.replace("supabasenewsletter.oncewerehumans.com:5432", "supabase-db:5432");
}

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
