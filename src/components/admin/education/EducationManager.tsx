"use client";

import { useActionState, useState } from "react";
import { deleteEducation, saveEducation } from "@/actions/education";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import {
  adminCardClassName,
  adminInputClassName,
  adminTableClassName,
  adminTdClassName,
  adminThClassName,
} from "@/lib/admin/forms";
import type { ActionState } from "@/lib/admin/action-utils";
import type { Education } from "@/types";

type EducationManagerProps = {
  education: Education[];
};

const emptyEducation = {
  id: "",
  degree: "",
  institution: "",
  date_range: "",
  icon: "graduation-cap",
  sort_order: 0,
};

export function EducationManager({ education }: EducationManagerProps) {
  const [editing, setEditing] = useState(emptyEducation);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(saveEducation, null);

  function startEdit(item: Education) {
    setEditing(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditing(emptyEducation);
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className={adminCardClassName}>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          {editing.id ? "Edit education" : "Add education"}
        </h3>
        <input type="hidden" name="id" value={editing.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <AdminFormField label="Degree" htmlFor="degree">
            <input
              id="degree"
              name="degree"
              value={editing.degree}
              onChange={(e) => setEditing({ ...editing, degree: e.target.value })}
              required
              className={adminInputClassName}
            />
          </AdminFormField>

          <AdminFormField label="Institution" htmlFor="institution">
            <input
              id="institution"
              name="institution"
              value={editing.institution}
              onChange={(e) =>
                setEditing({ ...editing, institution: e.target.value })
              }
              required
              className={adminInputClassName}
            />
          </AdminFormField>

          <AdminFormField label="Date range" htmlFor="date_range">
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
        </div>

        {state?.error ? <AdminAlert variant="error" message={state.error} className="mt-4" /> : null}
        {state?.success ? (
          <AdminAlert variant="success" message={state.success} className="mt-4" />
        ) : null}

        <div className="mt-4 flex gap-2">
          <AdminButton type="submit" disabled={isPending}>
            {isPending ? "Saving..." : editing.id ? "Update" : "Add education"}
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
          All education entries ({education.length})
        </h3>
        {education.length === 0 ? (
          <p className="text-sm text-gray-500">No education entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={adminTableClassName}>
              <thead>
                <tr>
                  <th className={adminThClassName}>Degree</th>
                  <th className={adminThClassName}>Institution</th>
                  <th className={adminThClassName}>Dates</th>
                  <th className={adminThClassName}>Order</th>
                  <th className={adminThClassName}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {education.map((item) => (
                  <tr key={item.id}>
                    <td className={adminTdClassName}>{item.degree}</td>
                    <td className={adminTdClassName}>{item.institution}</td>
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
                        <form action={deleteEducation}>
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
