import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  projectCount: number;
  experienceCount: number;
  unreadMessages: number;
  totalMessages: number;
  lastUpdated: string | null;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    projectsResult,
    experiencesResult,
    unreadResult,
    messagesResult,
    siteContentResult,
    latestProjectResult,
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("experiences").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("read", false),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase
      .from("site_content")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("projects")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const timestamps = [
    siteContentResult.data?.updated_at,
    latestProjectResult.data?.updated_at,
  ].filter(Boolean) as string[];

  const lastUpdated =
    timestamps.length > 0
      ? timestamps.sort((a, b) => (a < b ? 1 : -1))[0]
      : null;

  return {
    projectCount: projectsResult.count ?? 0,
    experienceCount: experiencesResult.count ?? 0,
    unreadMessages: unreadResult.count ?? 0,
    totalMessages: messagesResult.count ?? 0,
    lastUpdated,
  };
}
