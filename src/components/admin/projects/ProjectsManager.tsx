"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { deleteProject, saveProject } from "@/actions/projects";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import {
  FormattedTextEditor,
  type FormattedTextValue,
} from "@/components/admin/FormattedTextEditor";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { FormattedTextDisplay, getPlainFormattedPreview } from "@/components/ui/FormattedTextDisplay";
import { parseFormattedStorage } from "@/lib/admin/formatted-text";
import {
  adminCardClassName,
  adminInputClassName,
  adminTableClassName,
  adminTdClassName,
  adminThClassName,
} from "@/lib/admin/forms";
import type { ActionState } from "@/lib/admin/action-utils";
import type { Project } from "@/types";

type ProjectsManagerProps = {
  projects: Project[];
};

const emptyFormatted = (): FormattedTextValue => ({
  text: "",
  font_size: "base",
  text_align: "left",
});

const emptyProject = {
  id: "",
  icon: "folder-kanban",
  title: emptyFormatted(),
  description: emptyFormatted(),
  tech_stack_text: emptyFormatted(),
  live_link: "",
  github_link: "",
  image_url: "",
};

function projectToForm(project: Project) {
  const techStackSource =
    project.tech_stack_text ||
    (project.tech_stack.length > 0 ? project.tech_stack.join(", ") : "");

  return {
    id: project.id,
    icon: project.icon || "folder-kanban",
    title: parseFormattedStorage(project.title),
    description: parseFormattedStorage(project.description),
    tech_stack_text: parseFormattedStorage(techStackSource),
    live_link: project.live_link ?? "",
    github_link: project.github_link ?? "",
    image_url: project.image_url ?? "",
  };
}

export function ProjectsManager({ projects }: ProjectsManagerProps) {
  const [editing, setEditing] = useState(emptyProject);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);
  const [removeIcon, setRemoveIcon] = useState(false);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(saveProject, null);

  useEffect(() => {
    setIconPreviewUrl(editing.image_url || null);
    setRemoveIcon(false);
  }, [editing.id, editing.image_url]);

  useEffect(() => {
    return () => {
      if (iconPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(iconPreviewUrl);
      }
    };
  }, [iconPreviewUrl]);

  function handleIconChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setRemoveIcon(false);
    setIconPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(file);
    });
  }

  function handleRemoveIcon() {
    setRemoveIcon(true);
    setIconPreviewUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }

  function startEdit(project: Project) {
    setEditing(projectToForm(project));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditing(emptyProject);
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className={adminCardClassName}>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          {editing.id ? "Edit project" : "Add project"}
        </h3>
        <input type="hidden" name="id" value={editing.id} />
        <input
          type="hidden"
          name="image_url"
          value={removeIcon ? "" : editing.image_url ?? ""}
        />

        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <AdminFormField
              label="Project icon"
              htmlFor="project_icon"
              hint="Upload a square icon (PNG, JPG, WebP, or GIF). Used on the project card."
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-theme/10">
                  {iconPreviewUrl ? (
                    <Image
                      src={iconPreviewUrl}
                      alt="Project icon preview"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                      unoptimized={iconPreviewUrl.startsWith("blob:")}
                    />
                  ) : (
                    <DynamicIcon name={editing.icon} className="h-7 w-7 text-theme" />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <input
                    id="project_icon"
                    name="project_icon"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleIconChange}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-theme file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-theme-light"
                  />

                  {iconPreviewUrl ? (
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        name="remove_icon"
                        checked={removeIcon}
                        onChange={(event) => {
                          if (event.target.checked) {
                            handleRemoveIcon();
                          } else {
                            setRemoveIcon(false);
                            setIconPreviewUrl(editing.image_url || null);
                          }
                        }}
                      />
                      Remove uploaded icon
                    </label>
                  ) : null}
                </div>
              </div>
            </AdminFormField>

            <AdminFormField
              label="Fallback icon name"
              htmlFor="icon"
              hint="Lucide icon when no upload (e.g. folder-kanban, bot, rocket)"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-theme/10 text-theme">
                  <DynamicIcon name={editing.icon} className="h-5 w-5" />
                </div>
                <input
                  id="icon"
                  name="icon"
                  value={editing.icon}
                  onChange={(event) =>
                    setEditing({ ...editing, icon: event.target.value })
                  }
                  className={adminInputClassName}
                  placeholder="folder-kanban"
                />
              </div>
            </AdminFormField>
          </div>

          <AdminFormField label="Title" htmlFor="project-title">
            <FormattedTextEditor
              id="project-title"
              textName="title"
              value={editing.title}
              onChange={(title) => setEditing({ ...editing, title })}
              required
              rows={2}
              placeholder="Project title — use **bold** for emphasis"
            />
          </AdminFormField>

          <AdminFormField label="Description" htmlFor="project-description">
            <FormattedTextEditor
              id="project-description"
              textName="description"
              value={editing.description}
              onChange={(description) => setEditing({ ...editing, description })}
              rows={10}
              placeholder="Full project write-up. Supports **bold**, lists, and line breaks."
            />
          </AdminFormField>

          <AdminFormField
            label="Tech stack"
            htmlFor="project-tech-stack"
            hint="Technologies used — comma-separated or one per line"
          >
            <FormattedTextEditor
              id="project-tech-stack"
              textName="tech_stack_text"
              value={editing.tech_stack_text}
              onChange={(tech_stack_text) =>
                setEditing({ ...editing, tech_stack_text })
              }
              rows={3}
              placeholder="LangGraph, **OpenAI**, Supabase, FastAPI"
            />
          </AdminFormField>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminFormField label="Live link" htmlFor="live_link">
              <input
                id="live_link"
                name="live_link"
                type="url"
                value={editing.live_link}
                onChange={(event) =>
                  setEditing({ ...editing, live_link: event.target.value })
                }
                className={adminInputClassName}
              />
            </AdminFormField>

            <AdminFormField label="GitHub link" htmlFor="github_link">
              <input
                id="github_link"
                name="github_link"
                type="url"
                value={editing.github_link}
                onChange={(event) =>
                  setEditing({ ...editing, github_link: event.target.value })
                }
                className={adminInputClassName}
              />
            </AdminFormField>
          </div>
        </div>

        {state?.error ? <AdminAlert variant="error" message={state.error} className="mt-4" /> : null}
        {state?.success ? (
          <AdminAlert variant="success" message={state.success} className="mt-4" />
        ) : null}

        <div className="mt-4 flex gap-2">
          <AdminButton type="submit" disabled={isPending}>
            {isPending ? "Saving..." : editing.id ? "Update project" : "Add project"}
          </AdminButton>
          {editing.id ? (
            <AdminButton type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </AdminButton>
          ) : null}
        </div>
      </form>

      <div className={adminCardClassName}>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          All projects ({projects.length})
        </h3>
        {projects.length === 0 ? (
          <p className="text-sm text-gray-500">No projects yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={adminTableClassName}>
              <thead>
                <tr>
                  <th className={adminThClassName}>Project</th>
                  <th className={adminThClassName}>Links</th>
                  <th className={adminThClassName}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className={adminTdClassName}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-theme/10 text-theme">
                          {project.image_url ? (
                            <Image
                              src={project.image_url}
                              alt=""
                              width={36}
                              height={36}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <DynamicIcon name={project.icon} className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <FormattedTextDisplay
                            stored={project.title}
                            className="font-medium text-gray-900"
                            strongClassName="font-bold text-gray-900"
                          />
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {getPlainFormattedPreview(project.description, 100)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={adminTdClassName}>
                      <div className="space-y-1 text-xs">
                        {project.live_link ? (
                          <a
                            href={project.live_link}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-theme hover:underline"
                          >
                            Live
                          </a>
                        ) : null}
                        {project.github_link ? (
                          <a
                            href={project.github_link}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-theme hover:underline"
                          >
                            GitHub
                          </a>
                        ) : null}
                        {!project.live_link && !project.github_link ? "—" : null}
                      </div>
                    </td>
                    <td className={adminTdClassName}>
                      <div className="flex gap-2">
                        <AdminButton
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => startEdit(project)}
                        >
                          Edit
                        </AdminButton>
                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={project.id} />
                          <DeleteConfirmButton />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
