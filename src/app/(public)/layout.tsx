import { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getCollectionDataMap } from "@/lib/cms";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const sharedData = await getCollectionDataMap([
    "identitas-desa",
    "kontak-desa",
    "pengaturan-beranda",
  ]);

  const identitasData = sharedData["identitas-desa"] ?? {};
  const kontakData = sharedData["kontak-desa"] ?? {};
  const pengaturanData = sharedData["pengaturan-beranda"] ?? {};

  const desaName = identitasData.nama_desa || "Desa Cikahuripan";
  const kecamatan = identitasData.kecamatan || "Kec. Kadudampit";
  const kabupaten = identitasData.kabupaten || "Sukabumi";
  const provinsi = identitasData.provinsi || "Jawa Barat";
  const logo = pengaturanData.logo || "";

  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        desaName={desaName} 
        logo={logo} 
        kecamatan={kecamatan}
        kabupaten={kabupaten}
      />
      <main className="flex-1">{children}</main>
      <Footer 
        desaName={desaName}
        logo={logo} 
        kecamatan={kecamatan}
        kabupaten={kabupaten}
        provinsi={provinsi}
        kontak={kontakData} 
      />
    </div>
  );
}
