"use client";

import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";

export interface CustomSessionUser {
  user_id: string;
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  username?: string | null;
  role?: string | null;
}

export interface CustomSession {
  user: CustomSessionUser;
  expires?: string;
}

export interface UseSessionOptions {
  required?: boolean;
  onUnauthenticated?: () => void;
}

export function useSession(_options?: UseSessionOptions) {
  const { user, session, loading, signOut } = useSupabaseAuth();

  const update = async (_newSession?: any) => {
    return null;
  };

  if (loading) {
    return {
      data: null,
      status: "loading" as const,
      signOut,
      update,
    };
  }

  if (!user || !session) {
    return {
      data: null,
      status: "unauthenticated" as const,
      signOut,
      update,
    };
  }

  const customUser: CustomSessionUser = {
    user_id: user.id,
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    image: user.user_metadata?.avatar_url || user.user_metadata?.profile_photo || null,
    username: user.user_metadata?.username || null,
    role: user.user_metadata?.role || "FREE",
  };

  const customSession: CustomSession = {
    user: customUser,
    expires: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined,
  };

  return {
    data: customSession,
    status: "authenticated" as const,
    signOut,
    update,
  };
}
