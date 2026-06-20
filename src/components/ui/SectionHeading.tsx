import { cn } from "@/lib/utils";
import { gradientTextClass } from "@/lib/ui/gradient-classes";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 text-center", className)}>
      <h2 className={gradientTextClass("text-3xl font-bold md:text-4xl")}>{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-gray-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
