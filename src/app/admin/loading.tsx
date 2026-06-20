export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 rounded-lg bg-white shadow-sm" />
        ))}
      </div>
      <div className="h-80 rounded-lg bg-white shadow-sm" />
    </div>
  );
}
