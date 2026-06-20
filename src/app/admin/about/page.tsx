import { AboutForm } from "@/components/admin/forms/AboutForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StorageSetupAlert } from "@/components/admin/StorageSetupAlert";
import { getAboutContent } from "@/lib/admin/queries";
import { isPortfolioStorageConfigured } from "@/lib/admin/storage-setup";

export default async function AdminAboutPage() {
  const [content, storageConfigured] = await Promise.all([
    getAboutContent(),
    isPortfolioStorageConfigured(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="About"
        description="Edit the intro box photo, location, education, and rich-text about copy."
      />
      <StorageSetupAlert configured={storageConfigured} />
      <AboutForm content={content} />
    </div>
  );
}
