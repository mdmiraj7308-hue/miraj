import { PORTFOLIO_STORAGE_SETUP_HINT } from "@/lib/admin/storage-setup";

type StorageSetupAlertProps = {
  configured: boolean;
};

export function StorageSetupAlert({ configured }: StorageSetupAlertProps) {
  if (configured) return null;

  return (
    <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">Photo uploads need Supabase Storage setup</p>
      <p className="mt-1 text-amber-900">{PORTFOLIO_STORAGE_SETUP_HINT}</p>
      <p className="mt-2 text-amber-900">
        In Supabase: <strong>Storage</strong> → confirm a public{" "}
        <code className="rounded bg-amber-100 px-1">portfolio</code> bucket exists, then
        re-upload and click Save.
      </p>
    </div>
  );
}
