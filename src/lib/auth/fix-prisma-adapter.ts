import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter, AdapterUser } from "next-auth/adapters";

/**
 * Fix for the getUserByAccount issue in NextAuth PrismaAdapter.
 * The error occurs because the adapter tries to select 'user' but the field in Prisma is 'User'.
 */
export function fixPrismaAdapter(prisma: PrismaClient): Adapter {
  // Get the original adapter
  const originalAdapter = PrismaAdapter(prisma);

  // Create a fixed version with the corrected getUserByAccount method
  return {
    ...originalAdapter,
    // Override the problematic method with a fixed implementation
    getUserByAccount: async providerAccount => {
      console.log(
        `Looking up account for provider: ${providerAccount.provider}, ID: ${providerAccount.providerAccountId}`
      );

      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: providerAccount.provider,
            providerAccountId: providerAccount.providerAccountId,
          },
        },
        include: { User: true },
      });

      if (!account?.User) {
        console.warn("No user found for account:", providerAccount);
        return null;
      }

      // Map the database User model to the AdapterUser expected by NextAuth
      const user = account.User;
      console.log("Found user in adapter:", { userId: user.user_id, email: user.email });

      // Create the AdapterUser with explicitly assigned user_id
      const adapterUser = {
        id: user.user_id,
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.profile_photo || null,
        role: user.role || "FREE",
        status: user.status || "active",
      } as AdapterUser;

      console.log("Returning adapter user:", { id: adapterUser.id, user_id: adapterUser.user_id });
      return adapterUser;
    },
    createUser: async (user: Omit<AdapterUser, "id">) => {
      console.log("Creating new user with data:", {
        email: user.email,
        name: user.name,
        provider: "Based on OAuth data",
      });

      // Ensure we have a properly formatted name
      const name = user.name || user.email?.split("@")[0] || "User";

      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          name: name,
          profile_photo: user.image || null,
          emailVerified: user.emailVerified,
          status: "active",
          role: "FREE",
        },
      });

      console.log("Created new user:", { userId: newUser.user_id, email: newUser.email });

      return {
        id: newUser.user_id,
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        profile_photo: newUser.profile_photo,
        emailVerified: newUser.emailVerified,
        image: newUser.profile_photo || null, // Ensure image is set for NextAuth
        role: newUser.role || "FREE",
        status: newUser.status || "active",
      } as AdapterUser;
    },
  };
}
