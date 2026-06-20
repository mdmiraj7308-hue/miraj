import { Resend } from "resend";

type ContactEmailPayload = {
  to: string;
  name: string;
  email: string;
  message: string;
  subject?: string | null;
};

function getFromAddress(): string | null {
  return process.env.CONTACT_FROM_EMAIL?.trim() || null;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendContactNotificationEmail(
  payload: ContactEmailPayload,
): Promise<{ sent: boolean; error?: string }> {
  const resend = getResendClient();
  const from = getFromAddress();

  if (!resend || !from) {
    return { sent: false, error: "Email service is not configured." };
  }

  if (!payload.to) {
    return { sent: false, error: "Notification email is not set." };
  }

  const subjectLine = payload.subject?.trim()
    ? `Portfolio message: ${payload.subject.trim()}`
    : `New portfolio message from ${payload.name}`;

  const { error } = await resend.emails.send({
    from,
    to: payload.to,
    replyTo: payload.email,
    subject: subjectLine,
    text: [
      "You received a new message from your portfolio contact form.",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.subject?.trim() ? `Subject: ${payload.subject.trim()}` : null,
      "",
      "Message:",
      payload.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    return { sent: false, error: error.message };
  }

  return { sent: true };
}

export function isContactEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && getFromAddress());
}
