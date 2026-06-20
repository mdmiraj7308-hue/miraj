import { logout } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:border-theme hover:text-theme"
      >
        Logout
      </button>
    </form>
  );
}
