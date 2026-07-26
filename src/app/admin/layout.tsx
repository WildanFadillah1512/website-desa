import { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  // Bulletproof fallback: If middleware fails to intercept, the layout itself enforces login
  if (!session) {
    redirect("/");
  }

  return (
    <AdminLayoutClient user={session.user}>
      {children}
    </AdminLayoutClient>
  );
}
