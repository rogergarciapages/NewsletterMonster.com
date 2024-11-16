// src/lib/auth/custom-adapter.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@/lib/prisma-client";

export function CustomPrismaAdapter(p = prisma): Adapter {
  return {
    ...PrismaAdapter(p),
    createUser: async data => {
      const user = await p.user.create({
        data: {
          user_id: uuidv4(),
          email: data.email!,
          name: data.name ?? data.email?.split("@")[0] ?? "User",
          profile_photo: data.profile_photo,
          emailVerified: data.emailVerified,
          role: "FREE",
          domain_verified: false,
          status: "active",
        },
      });
      return user;
    },
    linkAccount: async data => {
      const account = await p.account.create({
        data: {
          userId: data.userId,
          type: data.type,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          refresh_token: data.refresh_token ?? null,
          access_token: data.access_token ?? null,
          expires_at: data.expires_at ?? null,
          token_type: data.token_type ?? null,
          scope: data.scope ?? null,
          id_token: data.id_token ?? null,
          session_state: data.session_state ?? null,
        },
      });
      return account;
    },
  };
}
