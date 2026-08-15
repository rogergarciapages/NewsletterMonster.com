// src/hooks/use-session.ts
"use client";

import { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider";

export interface CustomSessionUser {
  user_id: string;
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  profile_photo?: string | null;
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
  const [dbUserProfile, setDbUserProfile] = useState<{
    profile_photo?: string | null;
    username?: string | null;
    name?: string | null;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      fetch(`/api/users/${user.id}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && isMounted) {
            setDbUserProfile({
              profile_photo: data.profile_photo || null,
              username: data.username || null,
              name: data.name || null,
            });
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const update = async (_newSession?: any) => {
    if (user?.id) {
      try {
        const res = await fetch(`/api/users/${user.id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setDbUserProfile({
            profile_photo: data.profile_photo || null,
            username: data.username || null,
            name: data.name || null,
          });
        }
      } catch (_) {}
    }
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

  const avatar =
    dbUserProfile?.profile_photo ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.profile_photo ||
    user.user_metadata?.picture ||
    null;

  const customUser: CustomSessionUser = {
    user_id: user.id,
    id: user.id,
    email: user.email,
    name: dbUserProfile?.name || user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    image: avatar,
    profile_photo: avatar,
    username: dbUserProfile?.username || user.user_metadata?.username || null,
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
