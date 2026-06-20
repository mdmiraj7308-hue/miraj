type FooterProps = {
  name: string;
};

export function Footer({ name }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm text-gray-400">
          © {year} {name || "Portfolio"}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
