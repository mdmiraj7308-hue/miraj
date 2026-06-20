"use server";

import {
  getFormOptionalString,
  getFormString,
  type ActionState,
} from "@/lib/admin/action-utils";
import { getContactContent } from "@/lib/admin/queries";
import { sendContactNotificationEmail } from "@/lib/email/contact-notification";
import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState | null> {
  const honeypot = getFormString(formData, "website");
  if (honeypot) {
    return { success: "Message sent successfully." };
  }

  const name = getFormString(formData, "name");
  const email = getFormString(formData, "email");
  const message = getFormString(formData, "message");
  const subject = getFormOptionalString(formData, "subject");

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
    subject,
  });

  if (error) {
    return { error: "Unable to send message. Please try again later." };
  }

  const contact = await getContactContent();
  if (contact.notification_email) {
    await sendContactNotificationEmail({
      to: contact.notification_email,
      name,
      email,
      message,
      subject,
    });
  }

  return { success: "Message sent successfully. I'll get back to you soon!" };
}
