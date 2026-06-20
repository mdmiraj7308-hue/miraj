import { BioForm } from "@/components/admin/forms/BioForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StorageSetupAlert } from "@/components/admin/StorageSetupAlert";
import { getBioContent } from "@/lib/admin/queries";
import { isPortfolioStorageConfigured } from "@/lib/admin/storage-setup";

export default async function AdminBioPage() {
  const [content, storageConfigured] = await Promise.all([
    getBioContent(),
    isPortfolioStorageConfigured(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Bio / Hero"
        description="Edit your homepage headline, profile photo, typing roles, summary, and call-to-action buttons."
      />
      <StorageSetupAlert configured={storageConfigured} />
      <BioForm content={content} />
    </div>
  );
}
