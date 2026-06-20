import type { ReactNode } from "react";
import { InteractiveGridBackground } from "@/components/layout/InteractiveGridBackground";

type PublicPageShellProps = {
  children: ReactNode;
};

export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <>
      <InteractiveGridBackground />
      <div className="relative z-10">{children}</div>
    </>
  );
}
