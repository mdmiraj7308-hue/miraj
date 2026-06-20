"use client";

import { useActionState, useState } from "react";
import { deleteSkill, saveSkill } from "@/actions/skills";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import {
  SkillFormatControls,
  SkillTextPreview,
  type SkillFormatState,
} from "@/components/admin/skills/SkillFormatControls";
import {
  adminCardClassName,
  adminSelectClassName,
} from "@/lib/admin/forms";
import type { ActionState } from "@/lib/admin/action-utils";
import type { Skill, SkillCategory } from "@/types";

type SkillsManagerProps = {
  skills: Skill[];
};

const emptyFormat: SkillFormatState & { category: SkillCategory } = {
  text: "",
  category: "technical",
  font_size: "base",
  text_align: "left",
};

function skillToFormatState(skill: Skill) {
  return {
    text: skill.text,
    category: skill.category,
    font_size: skill.font_size,
    text_align: skill.text_align,
  };
}

export function SkillsManager({ skills }: SkillsManagerProps) {
  const [editingId, setEditingId] = useState("");
  const [format, setFormat] = useState(emptyFormat);
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(saveSkill, null);

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    setFormat(skillToFormatState(skill));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId("");
    setFormat(emptyFormat);
  }

  const technicalSkills = skills.filter((skill) => skill.category === "technical");
  const toolSkills = skills.filter((skill) => skill.category === "tool");

  return (
    <div className="space-y-6">
      <form action={formAction} className={adminCardClassName}>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          {editingId ? "Edit skill" : "Add skill"}
        </h3>
        <input type="hidden" name="id" value={editingId} />

        <div className="grid gap-5">
          <AdminFormField
            label="Section"
            htmlFor="category"
            hint="Technical Skills (left box) or Tools & Platforms (right box) on the homepage"
          >
            <select
              id="category"
              name="category"
              value={format.category}
              onChange={(event) =>
                setFormat({
                  ...format,
                  category: event.target.value as SkillCategory,
                })
              }
              className={adminSelectClassName}
            >
              <option value="technical">Technical Skills</option>
              <option value="tool">Tools & Platforms</option>
            </select>
          </AdminFormField>

          <AdminFormField
            label="Skill text"
            htmlFor="skill-text"
            hint="Select words and click B to bold them. Use **word** in the text for bold."
          >
            <SkillFormatControls
              textareaId="skill-text"
              value={format}
              onChange={(value) => setFormat({ ...format, ...value })}
              required
            />
          </AdminFormField>
        </div>

        {state?.error ? <AdminAlert variant="error" message={state.error} className="mt-4" /> : null}
        {state?.success ? (
          <AdminAlert variant="success" message={state.success} className="mt-4" />
        ) : null}

        <div className="mt-4 flex gap-2">
          <AdminButton type="submit" disabled={isPending}>
            {isPending ? "Saving..." : editingId ? "Update skill" : "Add skill"}
          </AdminButton>
          {editingId ? (
            <AdminButton type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </AdminButton>
          ) : null}
        </div>
      </form>

      <div className="grid gap-6 lg:grid-cols-2">
        <SkillList
          title={`Technical Skills (${technicalSkills.length})`}
          skills={technicalSkills}
          onEdit={startEdit}
        />
        <SkillList
          title={`Tools & Platforms (${toolSkills.length})`}
          skills={toolSkills}
          onEdit={startEdit}
        />
      </div>
    </div>
  );
}

function SkillList({
  title,
  skills,
  onEdit,
}: {
  title: string;
  skills: Skill[];
  onEdit: (skill: Skill) => void;
}) {
  return (
    <div className={adminCardClassName}>
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      {skills.length === 0 ? (
        <p className="text-sm text-gray-500">No items yet.</p>
      ) : (
        <ul className="space-y-3">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <SkillTextPreview
                  text={skill.text}
                  font_size={skill.font_size}
                  text_align={skill.text_align}
                />
              </div>
              <div className="flex shrink-0 gap-2">
                <AdminButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(skill)}
                >
                  Edit
                </AdminButton>
                <form action={deleteSkill}>
                  <input type="hidden" name="id" value={skill.id} />
                  <DeleteConfirmButton />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
