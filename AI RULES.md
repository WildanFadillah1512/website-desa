# AI Rules & Guidelines: Desa Cikahuripan Website

Aturan-aturan ini harus dipatuhi secara ketat oleh AI dan Developer saat mengembangkan dan merawat sistem ini.

## 1. Teknologi & Standar
- **Framework & Bahasa**: Next.js App Router, TypeScript strict mode (tidak boleh ada error, jangan gunakan `any` sembarangan, hindari `@ts-ignore` tanpa penjelasan).
- **Styling**: Tailwind CSS dengan pendekatan yang matang. Hindari gaya AI generik (glassmorphism berlebihan, gradient berlebihan, shadow tebal, border-radius ekstrem). Gunakan spasi grid kelipatan 8px dan radius 8-14px.
- **Warna Identitas Utama**: 
  - Primary (Forest Green): `#166534`
  - Primary Hover: `#14532D`
  - Secondary Green: `#2E7D32`
  - Background Soft: `#ECFDF3`
  - Surface: `#FFFFFF`
  - Text Primary: `#17211B`, Secondary: `#5E6B63`
- **Database**: PostgreSQL (di Aiven) dengan `sslmode=require`. **Kritis**: Limit koneksi maksimal 20. Gunakan Singleton pattern untuk Prisma/Drizzle. Jangan jalankan akses DB di Edge Runtime. Hindari pembukaan pool besar saat build.
- **Form & Validasi**: React Hook Form + Zod (validasi server-side dan client-side).

## 2. Arsitektur Konten & CMS Dinamis
- **Hybrid Approach**: 
  - Tabel Relasional: Untuk proses bisnis tetap (User, Berita, Agenda, Pengaduan, Galeri).
  - Schema-Driven (JSONB): Untuk konten dinamis yang field-nya dapat diatur admin kapan saja tanpa deploy (Profil Desa, Wilayah, Kependudukan, Dataset statistik).
- **Admin Fleksibilitas**: Admin harus bisa menambah field, ubah nama, tipe data, dan menentukan publisitas.
- **Stable Key**: Jangan pernah mengubah `stable_key` ketika `label` field diubah agar data lama tidak hilang. Gunakan Soft Delete untuk penghapusan.

## 3. Fitur Keamanan (Security)
- Validasi input dengan Zod secara mutlak di server.
- Sanitasi rich text.
- Gunakan query terparameterisasi/ORM stabil.
- Proteksi CSRF, XSS, dan SQL Injection.
- Autentikasi: Hashing menggunakan standar terkini (Bcrypt/Argon2id), session cookie HTTP-only & secure di production.
- Rate limit untuk form pengaduan dan login.
- **Pengaduan Masyarakat**: Jaga privasi pelapor mutlak; jangan ekspos identitas di UI publik. Gunakan nomor tiket aman.

## 4. UI/UX, Aksesibilitas, & SEO
- **Aksesibilitas**: Penuhi standar WCAG 2.1 AA. Semua image harus punya alt, navigasi dapat diakses keyboard, kontras memadai.
- **Animasi**: Ringan (150-250ms) dan taati prefers-reduced-motion.
- **SEO & Performa**: Metadata, sitemap, lazy-loading gambar, revalidate cache saat konten diupdate, serta performa maksimal.
- **UX Form**: Sediakan loading, success, empty state, dan dialog konfirmasi sebelum aksi destruktif.

## 5. Aturan Git & Alur Kerja
- Commit bertahap, masuk akal dan modular.
- Dilarang keras menonaktifkan strict mode demi lolos build.
- Jalankan linting, typechecking, dan testing pada setiap selesainya modul.
- Jangan commit file `.env`, connection string, atau credential lainnya.
