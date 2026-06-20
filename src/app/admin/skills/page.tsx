import { SkillsManager } from "@/components/admin/skills/SkillsManager";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSkills } from "@/lib/admin/queries";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        description="Add skills to Technical Skills or Tools & Platforms. Select text and bold specific words."
      />
      <SkillsManager skills={skills} />
    </div>
  );
}
