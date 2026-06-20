type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      ) : null}
    </div>
  );
}
