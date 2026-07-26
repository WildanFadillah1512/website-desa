import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Website Resmi Desa Cikahuripan",
    template: "%s — Desa Cikahuripan",
  },
  description:
    "Website resmi Desa Cikahuripan, Kecamatan Kadudampit, Kabupaten Sukabumi, Jawa Barat. Memuat informasi publik, layanan pengaduan, dan potensi desa.",
  keywords: ["Desa Cikahuripan", "Kadudampit", "Sukabumi", "website desa", "layanan publik"],
  authors: [{ name: "Pemerintah Desa Cikahuripan" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Desa Cikahuripan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-white text-[#17211B]">
        {children}
      </body>
    </html>
  );
}
