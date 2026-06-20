export default function Loading() {
  return (
    <div className="relative z-10 min-h-screen bg-background px-6 pt-28">
      <div className="mx-auto max-w-6xl animate-pulse space-y-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <div className="h-40 w-40 rounded-full bg-white/10" />
          <div className="h-10 w-2/3 rounded-lg bg-white/10" />
          <div className="h-6 w-1/2 rounded-lg bg-white/10" />
          <div className="h-20 w-full rounded-lg bg-white/10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 rounded-xl bg-white/10" />
          <div className="h-64 rounded-xl bg-white/10" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-72 rounded-xl bg-white/10" />
          <div className="h-72 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
