import Header from "@/components/Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-screen bg-background">{children}</main>
    </>
  );
}