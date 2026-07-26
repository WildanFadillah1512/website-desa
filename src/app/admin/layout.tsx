import { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";
import { getCollectionDataMap } from "@/lib/cms";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/4d31n");
  }

  const sharedData = await getCollectionDataMap(["pengaturan-beranda", "identitas-desa"]);
  const pengaturanData = sharedData["pengaturan-beranda"] ?? {};
  const identitasData = sharedData["identitas-desa"] ?? {};

  return (
    <AdminLayoutClient
      user={session.user}
      logo={pengaturanData.logo || ""}
      desaName={identitasData.nama_desa || "Desa"}
    >
      {children}
    </AdminLayoutClient>
  );
}
