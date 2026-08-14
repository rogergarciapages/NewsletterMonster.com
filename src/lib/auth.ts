import { getServerSession as getSupabaseSession, ServerSession } from "./auth/get-server-session";

export const authOptions = {};

export async function getServerSession(_options?: any): Promise<ServerSession | null> {
  return getSupabaseSession();
}
