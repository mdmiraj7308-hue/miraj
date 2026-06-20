export function normalizeWhatsAppUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^wa\.me\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 8 && digits.length <= 15) {
    return `https://wa.me/${digits}`;
  }

  return trimmed;
}

export function isValidWhatsAppUrl(url: string): boolean {
  if (!url) return true;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    return (
      host === "wa.me" ||
      host === "api.whatsapp.com" ||
      host === "chat.whatsapp.com" ||
      host.endsWith(".whatsapp.com")
    );
  } catch {
    return false;
  }
}
