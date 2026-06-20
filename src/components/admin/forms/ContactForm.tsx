"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateContact } from "@/actions/site-content";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminFormField } from "@/components/admin/AdminFormField";
import {
  adminCardClassName,
  adminInputClassName,
} from "@/lib/admin/forms";
import type { ActionState } from "@/lib/admin/action-utils";
import type { ContactContent, SocialLink } from "@/types";

type ContactFormProps = {
  content: ContactContent;
  emailConfigured?: boolean;
};

export function ContactForm({
  content,
  emailConfigured = false,
}: ContactFormProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    content.social_links.length > 0 ? content.social_links : [],
  );
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(updateContact, null);

  function addSocialLink() {
    setSocialLinks((prev) => [...prev, { name: "", url: "", icon: "link" }]);
  }

  function removeSocialLink(index: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSocialLink(index: number, field: keyof SocialLink, value: string) {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    );
  }

  return (
    <form action={formAction} className={adminCardClassName}>
      <input
        type="hidden"
        name="social_links_json"
        value={JSON.stringify(socialLinks)}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <AdminFormField label="Section title" htmlFor="title">
          <input
            id="title"
            name="title"
            defaultValue={content.title}
            required
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField label="Form title" htmlFor="form_title">
          <input
            id="form_title"
            name="form_title"
            defaultValue={content.form_title}
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField label="Message buttons title" htmlFor="connect_title">
          <input
            id="connect_title"
            name="connect_title"
            defaultValue={content.connect_title}
            className={adminInputClassName}
            placeholder="Send Messages"
          />
        </AdminFormField>

        <AdminFormField
          label="Notification email"
          htmlFor="notification_email"
          hint="Receive contact form messages in your inbox (requires Resend setup in .env)"
          className="md:col-span-2"
        >
          <input
            id="notification_email"
            name="notification_email"
            type="email"
            defaultValue={content.notification_email}
            className={adminInputClassName}
            placeholder="you@example.com"
          />
        </AdminFormField>

        <AdminFormField
          label="WhatsApp link"
          htmlFor="whatsapp_url"
          hint="Shown as a floating button on the site. Use a wa.me link or phone number with country code."
          className="md:col-span-2"
        >
          <input
            id="whatsapp_url"
            name="whatsapp_url"
            type="url"
            defaultValue={content.whatsapp_url}
            className={adminInputClassName}
            placeholder="https://wa.me/8801234567890"
          />
        </AdminFormField>
      </div>

      {!emailConfigured ? (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Email delivery needs{" "}
          <code className="rounded bg-amber-100 px-1">RESEND_API_KEY</code> and{" "}
          <code className="rounded bg-amber-100 px-1">CONTACT_FROM_EMAIL</code> in
          your <code className="rounded bg-amber-100 px-1">.env</code> file. Messages
          still save to the admin inbox without this.
        </div>
      ) : null}

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Message buttons</h3>
          <AdminButton type="button" variant="secondary" size="sm" onClick={addSocialLink}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add button
          </AdminButton>
        </div>

        {socialLinks.length === 0 ? (
          <p className="text-sm text-gray-500">No message buttons yet.</p>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-md border border-gray-200 p-3 md:grid-cols-[1fr_1fr_120px_auto]"
              >
                <input
                  value={link.name}
                  onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                  placeholder="Name"
                  className={adminInputClassName}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                  placeholder="URL"
                  className={adminInputClassName}
                />
                <input
                  value={link.icon}
                  onChange={(e) => updateSocialLink(index, "icon", e.target.value)}
                  placeholder="Icon"
                  className={adminInputClassName}
                />
                <AdminButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  aria-label="Remove social link"
                >
                  <Trash2 className="h-4 w-4" />
                </AdminButton>
              </div>
            ))}
          </div>
        )}
      </div>

      {state?.error ? <AdminAlert variant="error" message={state.error} className="mt-5" /> : null}
      {state?.success ? (
        <AdminAlert variant="success" message={state.success} className="mt-5" />
      ) : null}

      <div className="mt-6">
        <AdminButton type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Contact"}
        </AdminButton>
      </div>
    </form>
  );
}
