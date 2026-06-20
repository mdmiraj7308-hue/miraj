import { EducationManager } from "@/components/admin/education/EducationManager";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getEducationEntries } from "@/lib/admin/queries";

export default async function AdminEducationPage() {
  const education = await getEducationEntries();

  return (
    <div>
      <AdminPageHeader
        title="Education"
        description="Manage your academic background and degrees."
      />
      <EducationManager education={education} />
    </div>
  );
}
