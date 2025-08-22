import Header from "@/components/layout/Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-background">{children}</main>
    </>
  );
}