"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { updateBio } from "@/actions/site-content";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminFormField } from "@/components/admin/AdminFormField";
import {
  FormattedTextEditor,
  type FormattedTextValue,
} from "@/components/admin/FormattedTextEditor";
import { parseFormattedStorage } from "@/lib/admin/formatted-text";
import {
  adminCardClassName,
  adminInputClassName,
  adminTextareaClassName,
} from "@/lib/admin/forms";
import type { ActionState } from "@/lib/admin/action-utils";
import type { BioContent } from "@/types";

type BioFormProps = {
  content: BioContent;
};

function parseSummaryValue(stored: string): FormattedTextValue {
  const parsed = parseFormattedStorage(stored);
  const isLegacyPlainText =
    stored.trim().length > 0 && !stored.trim().startsWith("---");

  return isLegacyPlainText
    ? { ...parsed, text_align: "center" }
    : parsed;
}

export function BioForm({ content }: BioFormProps) {
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(updateBio, null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    content.avatar_url,
  );
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [summary, setSummary] = useState<FormattedTextValue>(() =>
    parseSummaryValue(content.summary),
  );

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    setPreviewUrl(content.avatar_url);
    setRemoveAvatar(false);
  }, [content.avatar_url]);

  useEffect(() => {
    setSummary(parseSummaryValue(content.summary));
  }, [content.summary]);

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setRemoveAvatar(false);
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(file);
    });
  }

  function handleRemoveAvatar() {
    setRemoveAvatar(true);
    setPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }

  return (
    <form action={formAction} className={adminCardClassName}>
      <input type="hidden" name="hero_icon" value={content.hero_icon || "user"} />
      <input
        type="hidden"
        name="avatar_url"
        value={removeAvatar ? "" : content.avatar_url ?? ""}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <AdminFormField label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            defaultValue={content.name}
            required
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField
          label="Profile photo"
          htmlFor="avatar"
          hint="Upload a square photo for the hero section (max 5 MB)"
          className="md:col-span-2"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="profile-ring flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                  unoptimized={previewUrl.startsWith("blob:")}
                />
              ) : (
                <span className="px-3 text-center text-xs text-gray-500">
                  No photo yet
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-theme file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-theme-light"
              />

              {previewUrl ? (
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="remove_avatar"
                    checked={removeAvatar}
                    onChange={(event) => {
                      if (event.target.checked) {
                        handleRemoveAvatar();
                      } else {
                        setRemoveAvatar(false);
                        setPreviewUrl(content.avatar_url);
                      }
                    }}
                  />
                  Remove current photo
                </label>
              ) : null}
            </div>
          </div>
        </AdminFormField>

        <AdminFormField
          label="Typed roles"
          htmlFor="typed_roles"
          hint="One role per line (typing animation)"
          className="md:col-span-2"
        >
          <textarea
            id="typed_roles"
            name="typed_roles"
            defaultValue={content.typed_roles.join("\n")}
            className={adminTextareaClassName}
            rows={4}
          />
        </AdminFormField>

        <AdminFormField
          label="Short intro"
          htmlFor="summary"
          hint="Shown above the action buttons on the hero. Use bold, size, and alignment."
          className="md:col-span-2"
        >
          <FormattedTextEditor
            id="summary"
            textName="summary"
            value={summary}
            onChange={setSummary}
            rows={4}
            placeholder="A brief intro about you..."
            previewClassName="text-gray-800"
            strongClassName="font-bold text-gray-900"
          />
        </AdminFormField>

        <AdminFormField label="Primary CTA label" htmlFor="cta_primary_label">
          <input
            id="cta_primary_label"
            name="cta_primary_label"
            defaultValue={content.cta_primary_label}
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField label="Primary CTA link" htmlFor="cta_primary_href">
          <input
            id="cta_primary_href"
            name="cta_primary_href"
            defaultValue={content.cta_primary_href}
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField label="Secondary CTA label" htmlFor="cta_secondary_label">
          <input
            id="cta_secondary_label"
            name="cta_secondary_label"
            defaultValue={content.cta_secondary_label}
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField label="Secondary CTA link" htmlFor="cta_secondary_href">
          <input
            id="cta_secondary_href"
            name="cta_secondary_href"
            defaultValue={content.cta_secondary_href}
            className={adminInputClassName}
          />
        </AdminFormField>
      </div>

      {state?.error ? <AdminAlert variant="error" message={state.error} className="mt-5" /> : null}
      {state?.success ? (
        <AdminAlert variant="success" message={state.success} className="mt-5" />
      ) : null}

      <div className="mt-6">
        <AdminButton type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Bio"}
        </AdminButton>
      </div>
    </form>
  );
}
