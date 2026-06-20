import { ExperiencesManager } from "@/components/admin/experiences/ExperiencesManager";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getExperiences } from "@/lib/admin/queries";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div>
      <AdminPageHeader
        title="Experience"
        description="Manage work history with rich-text descriptions (bold, size, alignment)."
      />
      <ExperiencesManager experiences={experiences} />
    </div>
  );
}
