import { ProjectsManager } from "@/components/admin/projects/ProjectsManager";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getProjects } from "@/lib/admin/queries";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Upload a custom icon per project, plus rich text on title, description, and tech stack."
      />
      <ProjectsManager projects={projects} />
    </div>
  );
}
