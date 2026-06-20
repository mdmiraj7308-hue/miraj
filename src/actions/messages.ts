"use server";

import {
  getFormString,
  requireAuth,
  revalidateAdmin,
} from "@/lib/admin/action-utils";

export async function toggleMessageRead(formData: FormData): Promise<void> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return;

  const id = getFormString(formData, "id");
  const read = getFormString(formData, "read") === "true";
  if (!id) return;

  await supabase.from("contact_messages").update({ read }).eq("id", id);
  revalidateAdmin("/admin/messages");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return;

  const id = getFormString(formData, "id");
  if (!id) return;

  await supabase.from("contact_messages").delete().eq("id", id);
  revalidateAdmin("/admin/messages");
}

export async function markAllMessagesRead(): Promise<void> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return;

  await supabase
    .from("contact_messages")
    .update({ read: true })
    .eq("read", false);

  revalidateAdmin("/admin/messages");
}
