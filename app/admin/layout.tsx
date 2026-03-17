"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="relative min-h-screen text-white flex">
      {!isLoginPage && <AdminSidebar />}

      <div className={`relative z-10 font-sans flex flex-col flex-1 min-h-screen ${!isLoginPage ? "ml-64 p-8" : ""}`}>
        {children}
      </div>
    </div>
  );
}
