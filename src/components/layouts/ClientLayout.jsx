"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {children}
      {!isDashboardRoute && <Footer />}
    </>
  );
}
