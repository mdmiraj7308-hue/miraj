"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { updateAbout } from "@/actions/site-content";
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
} from "@/lib/admin/forms";
import type { ActionState } from "@/lib/admin/action-utils";
import type { AboutContent } from "@/types";

type AboutFormProps = {
  content: AboutContent;
};

export function AboutForm({ content }: AboutFormProps) {
  const [bodyText, setBodyText] = useState<FormattedTextValue>(() =>
    parseFormattedStorage(content.body_text),
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(content.avatar_url);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(updateAbout, null);

  useEffect(() => {
    setBodyText(parseFormattedStorage(content.body_text));
  }, [content.body_text]);

  useEffect(() => {
    setPreviewUrl(content.avatar_url);
    setRemoveAvatar(false);
  }, [content.avatar_url]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
      <input
        type="hidden"
        name="avatar_url"
        value={removeAvatar ? "" : content.avatar_url ?? ""}
      />

      <div className="grid gap-5">
        <AdminFormField label="Section title" htmlFor="title">
          <input
            id="title"
            name="title"
            defaultValue={content.title}
            required
            className={adminInputClassName}
          />
        </AdminFormField>

        <AdminFormField
          label="Intro box photo"
          htmlFor="about_avatar"
          hint="Separate photo for the About left box (independent from the hero photo)"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="profile-ring flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="About intro preview"
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
                id="about_avatar"
                name="about_avatar"
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
          label="Intro title"
          htmlFor="intro_title"
          hint='Shown below your photo in the left box (default: "My intro")'
        >
          <input
            id="intro_title"
            name="intro_title"
            defaultValue={content.intro_title}
            className={adminInputClassName}
          />
        </AdminFormField>

        <div className="grid gap-5 md:grid-cols-2">
          <AdminFormField
            label="Location"
            htmlFor="location"
            hint="Bottom-left of the intro box"
          >
            <input
              id="location"
              name="location"
              defaultValue={content.location}
              className={adminInputClassName}
              placeholder="Dhaka, Bangladesh"
            />
          </AdminFormField>

          <AdminFormField
            label="Education"
            htmlFor="education"
            hint="Bottom-right of the intro box"
          >
            <input
              id="education"
              name="education"
              defaultValue={content.education}
              className={adminInputClassName}
              placeholder="BSc in Computer Science"
            />
          </AdminFormField>
        </div>

        <AdminFormField
          label="About text"
          htmlFor="about-body-text"
          hint="Bold, font size, alignment — line breaks and structure are preserved"
        >
          <FormattedTextEditor
            id="about-body-text"
            textName="body_text"
            value={bodyText}
            onChange={setBodyText}
            rows={12}
            placeholder="Write about yourself, your work, and what you do..."
          />
        </AdminFormField>
      </div>

      {state?.error ? <AdminAlert variant="error" message={state.error} className="mt-5" /> : null}
      {state?.success ? (
        <AdminAlert variant="success" message={state.success} className="mt-5" />
      ) : null}

      <div className="mt-6">
        <AdminButton type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save About"}
        </AdminButton>
      </div>
    </form>
  );
}
