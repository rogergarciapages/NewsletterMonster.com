// src/lib/auth/custom-adapter.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@/lib/prisma-client";

interface DatabaseUser {
  user_id: string;
  email: string;
  name: string;
  emailVerified: Date | null;
  profile_photo: string | null;
  role: string;
  domain_verified: boolean;
  status: string | null;
  username: string | null;
  password: string | null;
  created_at: Date | null;
}

function mapToAdapterUser(dbUser: DatabaseUser): AdapterUser {
  return {
    id: dbUser.user_id,
    email: dbUser.email,
    name: dbUser.name,
    emailVerified: dbUser.emailVerified,
    image: dbUser.profile_photo,
    user_id: dbUser.user_id,
    role: dbUser.role,
    domain_verified: dbUser.domain_verified,
    status: dbUser.status ?? "active",
  };
}

export function CustomPrismaAdapter(p = prisma): Adapter {
  const adapter = PrismaAdapter(p);
  return {
    ...adapter,
    createUser: async data => {
      const userId = uuidv4();
      const user = await p.user.create({
        data: {
          user_id: userId,
          email: data.email!,
          name: data.name ?? data.email?.split("@")[0] ?? "User",
          profile_photo: data.image ?? null,
          emailVerified: data.emailVerified,
          role: "FREE",
          domain_verified: false,
          status: "active",
        },
      });

      return mapToAdapterUser(user as DatabaseUser);
    },
    getUser: async id => {
      const user = await p.user.findUnique({
        where: { user_id: id },
      });
      if (!user) return null;
      return mapToAdapterUser(user as DatabaseUser);
    },
    getUserByEmail: async email => {
      const user = await p.user.findUnique({
        where: { email },
      });
      if (!user) return null;
      return mapToAdapterUser(user as DatabaseUser);
    },
    linkAccount: async (data: AdapterAccount): Promise<void> => {
      await p.account.create({
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
    },
  };
}
