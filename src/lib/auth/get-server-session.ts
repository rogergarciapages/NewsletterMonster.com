import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export interface ServerSession {
  user: {
    user_id: string;
    id: string;
    email: string;
    name: string;
    username?: string | null;
    profile_photo?: string | null;
    role?: string | null;
  };
}

export async function getServerSession(): Promise<ServerSession | null> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // First try standard cookie auth
    let {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser();

    // If cookie auth failed, check for Bearer token in Authorization header
    if ((error || !supabaseUser) && typeof headers === "function") {
      try {
        const headerStore = headers();
        const authHeader = headerStore.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.substring(7);
          const res = await supabase.auth.getUser(token);
          if (res.data?.user) {
            supabaseUser = res.data.user;
            error = null;
          }
        }
      } catch (_) {}
    }

    if (error || !supabaseUser || !supabaseUser.email) {
      return null;
    }

    // Lookup or upsert user in Prisma
    let dbUser = await prisma.user.findUnique({
      where: { email: supabaseUser.email },
    });

    if (!dbUser) {
      const name =
        supabaseUser.user_metadata?.name ||
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.email.split("@")[0];
      const profile_photo =
        supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.profile_photo || null;

      dbUser = await prisma.user.create({
        data: {
          user_id: supabaseUser.id,
          email: supabaseUser.email,
          name,
          profile_photo,
        },
      });
    }

    return {
      user: {
        user_id: dbUser.user_id,
        id: dbUser.user_id,
        email: dbUser.email,
        name: dbUser.name,
        username: dbUser.username,
        profile_photo: dbUser.profile_photo,
        role: dbUser.role,
      },
    };
  } catch (err) {
    console.error("Error retrieving Supabase server session:", err);
    return null;
  }
}
