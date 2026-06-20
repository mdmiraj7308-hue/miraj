"use client";

import { useActionState, useState } from "react";
import { deleteExperience, saveExperience } from "@/actions/experiences";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import {
  FormattedTextEditor,
  type FormattedTextValue,
} from "@/components/admin/FormattedTextEditor";
import { getPlainFormattedPreview } from "@/components/ui/FormattedTextDisplay";
import { parseFormattedStorage } from "@/lib/admin/formatted-text";
import {
  adminCardClassName,
  adminInputClassName,
  adminTableClassName,
  adminTdClassName,
  adminThClassName,
} from "@/lib/admin/forms";
import type { ActionState } from "@/lib/admin/action-utils";
import type { Experience } from "@/types";

type ExperiencesManagerProps = {
  experiences: Experience[];
};

const emptyDescription = (): FormattedTextValue => ({
  text: "",
  font_size: "base",
  text_align: "left",
});

const emptyExperience = {
  id: "",
  title: "",
  company: "",
  date_range: "",
  description: emptyDescription(),
  skills: [] as string[],
  icon: "briefcase",
  sort_order: 0,
};

function experienceToForm(item: Experience) {
  return {
    id: item.id,
    title: item.title,
    company: item.company,
    date_range: item.date_range,
    description: parseFormattedStorage(item.description),
    skills: item.skills,
    icon: item.icon,
    sort_order: item.sort_order,
  };
}

export function ExperiencesManager({ experiences }: ExperiencesManagerProps) {
  const [editing, setEditing] = useState(emptyExperience);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(saveExperience, null);

  function startEdit(item: Experience) {
    setEditing(experienceToForm(item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditing(emptyExperience);
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className={adminCardClassName}>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          {editing.id ? "Edit experience" : "Add experience"}
        </h3>
        <input type="hidden" name="id" value={editing.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Title" htmlFor="title">
            <input
              id="title"
              name="title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              required
              className={adminInputClassName}
            />
          </AdminFormField>

          <AdminFormField label="Company" htmlFor="company">
            <input
              id="company"
              name="company"
              value={editing.company}
              onChange={(e) => setEditing({ ...editing, company: e.target.value })}
              required
              className={adminInputClassName}
            />
          </AdminFormField>

          <AdminFormField label="Date range" htmlFor="date_range" hint="e.g. 2022 – Present">
            <input
              id="date_range"
              name="date_range"
              value={editing.date_range}
              onChange={(e) =>
                setEditing({ ...editing, date_range: e.target.value })
              }
              required
              className={adminInputClassName}
            />
          </AdminFormField>

          <AdminFormField label="Icon" htmlFor="icon" hint="Lucide icon name">
            <input
              id="icon"
              name="icon"
              value={editing.icon}
              onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
              className={adminInputClassName}
            />
          </AdminFormField>

          <AdminFormField
            label="Skills"
            htmlFor="skills"
            hint="Comma-separated"
          >
            <input
              id="skills"
              name="skills"
              value={editing.skills.join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className={adminInputClassName}
            />
          </AdminFormField>

          <AdminFormField label="Sort order" htmlFor="sort_order">
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              value={editing.sort_order}
              onChange={(e) =>
                setEditing({ ...editing, sort_order: Number(e.target.value) })
              }
              className={adminInputClassName}
            />
          </AdminFormField>

          <AdminFormField
            label="Description"
            htmlFor="experience-description"
            hint="Bold, font size, alignment — line breaks are preserved"
            className="md:col-span-2"
          >
            <FormattedTextEditor
              id="experience-description"
              textName="description"
              fontSizeName="description_font_size"
              alignName="description_text_align"
              value={editing.description}
              onChange={(description) => setEditing({ ...editing, description })}
              rows={8}
              placeholder="Describe your role, impact, and achievements..."
            />
          </AdminFormField>
        </div>

        {state?.error ? <AdminAlert variant="error" message={state.error} className="mt-4" /> : null}
        {state?.success ? (
          <AdminAlert variant="success" message={state.success} className="mt-4" />
        ) : null}

        <div className="mt-4 flex gap-2">
          <AdminButton type="submit" disabled={isPending}>
            {isPending ? "Saving..." : editing.id ? "Update" : "Add experience"}
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
          All experience entries ({experiences.length})
        </h3>
        {experiences.length === 0 ? (
          <p className="text-sm text-gray-500">No experience entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={adminTableClassName}>
              <thead>
                <tr>
                  <th className={adminThClassName}>Role</th>
                  <th className={adminThClassName}>Company</th>
                  <th className={adminThClassName}>Dates</th>
                  <th className={adminThClassName}>Order</th>
                  <th className={adminThClassName}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((item) => (
                  <tr key={item.id}>
                    <td className={adminTdClassName}>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {getPlainFormattedPreview(item.description, 80)}
                      </p>
                    </td>
                    <td className={adminTdClassName}>{item.company}</td>
                    <td className={adminTdClassName}>{item.date_range}</td>
                    <td className={adminTdClassName}>{item.sort_order}</td>
                    <td className={adminTdClassName}>
                      <div className="flex gap-2">
                        <AdminButton
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </AdminButton>
                        <form action={deleteExperience}>
                          <input type="hidden" name="id" value={item.id} />
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
