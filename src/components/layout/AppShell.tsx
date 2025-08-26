import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-screen bg-background">{children}</main>
      <SiteFooter />
    </>
  );
}