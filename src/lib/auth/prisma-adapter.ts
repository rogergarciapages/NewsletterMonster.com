// src/lib/auth/prisma-adapter.ts
import { PrismaClient } from "@prisma/client";
import { Adapter, AdapterAccount, AdapterSession, AdapterUser } from "next-auth/adapters";

interface DbUser {
  user_id: string;
  email: string;
  name: string;
  emailVerified: Date | null;
  profile_photo: string | null;
  username: string | null;
  role: string;
  password: string | null;
  status: string;
}

type CustomUser = AdapterUser & {
  user_id: string;
  role: string;
  status: string;
};

function convertToAdapterUser(user: DbUser): CustomUser {
  return {
    id: user.user_id,
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.profile_photo ?? undefined,
    role: user.role,
    status: user.status || "active",
    domain_verified: false,
  };
}

export function createPrismaAdapter(p: PrismaClient): Adapter {
  return {
    createUser: async (data: Omit<AdapterUser, "id">) => {
      const user = await p.user.create({
        data: {
          email: data.email!,
          name: data.name ?? data.email?.split("@")[0] ?? "User",
          profile_photo: data.image,
          emailVerified: data.emailVerified,
          role: "FREE",
          status: "active",
        },
      });
      return convertToAdapterUser(user as DbUser);
    },

    getUser: async (id: string) => {
      const user = await p.user.findUnique({ where: { user_id: id } });
      if (!user) return null;
      return convertToAdapterUser(user as DbUser);
    },

    getUserByEmail: async (email: string) => {
      const user = await p.user.findUnique({ where: { email } });
      if (!user) return null;
      return convertToAdapterUser(user as DbUser);
    },

    getUserByAccount: async (providerAccount: { provider: string; providerAccountId: string }) => {
      const account = await p.account.findFirst({
        where: {
          provider: providerAccount.provider,
          providerAccountId: providerAccount.providerAccountId,
        },
        select: {
          User: true,
        },
      });
      if (!account?.User) return null;
      return convertToAdapterUser(account.User as DbUser);
    },

    updateUser: async (data: Partial<CustomUser> & { id: string }) => {
      const user = await p.user.update({
        where: { user_id: data.id },
        data: {
          name: data.name,
          email: data.email,
          profile_photo: data.image,
          emailVerified: data.emailVerified,
        },
      });
      return convertToAdapterUser(user as DbUser);
    },

    deleteUser: async (userId: string) => {
      await p.user.delete({ where: { user_id: userId } });
    },

    linkAccount: async (data: AdapterAccount) => {
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

    unlinkAccount: async ({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }) => {
      await p.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });
    },

    createSession: async (data: AdapterSession) => {
      const session = await p.session.create({
        data: {
          sessionToken: data.sessionToken,
          userId: data.userId,
          expires: data.expires,
        },
      });
      return session;
    },

    getSessionAndUser: async (sessionToken: string) => {
      const result = await p.session.findUnique({
        where: { sessionToken },
        include: { User: true },
      });

      if (!result) return null;

      const { User, ...session } = result;
      return {
        session: {
          userId: session.userId,
          sessionToken: session.sessionToken,
          expires: session.expires,
        },
        user: convertToAdapterUser(User as DbUser),
      };
    },

    updateSession: async (data: Partial<AdapterSession> & { sessionToken: string }) => {
      const session = await p.session.update({
        where: { sessionToken: data.sessionToken },
        data: {
          expires: data.expires,
        },
      });
      return session;
    },

    deleteSession: async (sessionToken: string) => {
      await p.session.delete({ where: { sessionToken } });
    },
  };
}
