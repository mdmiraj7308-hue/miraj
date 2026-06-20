"use client";

import { useActionState } from "react";
import { login, type AuthActionState } from "@/actions/auth";

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<
    AuthActionState | null,
    FormData
  >(login, null);

  return (
    <form action={formAction} className="space-y-5 text-left">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-white outline-none focus:border-theme-light"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-white outline-none focus:border-theme-light"
          placeholder="Your password"
        />
      </div>

      {state?.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-theme py-3 font-medium text-white transition hover:bg-theme-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
