import { LoginForm } from "@/components/admin/LoginForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? "/admin";

  return (
    <PublicPageShell>
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="glassmorphism theme-glow w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h1 className="gradient-text mb-2 text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-gray-400">
              Sign in to manage your portfolio content.
            </p>
          </div>
          <LoginForm redirectTo={redirectTo} />
        </div>
      </main>
    </PublicPageShell>
  );
}
