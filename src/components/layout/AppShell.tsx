import Header from "@/components/layout/Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 bg-white px-3 py-2 rounded shadow"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="min-h-screen bg-background">{children}</main>
    </>
  );
}