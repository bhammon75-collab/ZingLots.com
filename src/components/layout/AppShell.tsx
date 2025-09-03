import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLocation } from "react-router-dom";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 bg-white px-3 py-2 rounded shadow"
      >
        Skip to content
      </a>
      <Header showSearch={isHome} />
      <main id="main" className="min-h-screen bg-background">{children}</main>
      <Footer />
    </>
  );
}