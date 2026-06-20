import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

type AdminPlaceholderProps = {
  title: string;
  description: string;
};

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <AdminPageHeader title={title} description={description} />
      <p className="text-sm text-gray-500">Editor coming in the next step.</p>
    </div>
  );
}
