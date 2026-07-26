# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Warga desa (village residents) Cikahuripan dan aparatur desa. Warga membutuhkan informasi lokal (berita, agenda, potensi desa), layanan pengajuan surat secara daring, portal pendidikan EduVillage, statistik kependudukan, serta kanal pengaduan. Aparatur desa membutuhkan panel admin (CMS) yang fleksibel untuk mengelola seluruh konten dan struktur data tanpa mengubah kode.

## Product Purpose
Sebagai website resmi Desa Cikahuripan (Kecamatan Kadudampit, Kabupaten Sukabumi, Jawa Barat) yang komprehensif, mencakup portal informasi publik dan sistem manajemen konten (CMS) dinamis. Website ini menjadi sarana transparansi, pelayanan publik digital, serta promosi potensi desa.

## Positioning
Platform desa digital yang "future-proof" dengan arsitektur hybrid (tabel relasional & schema-driven JSONB) yang memungkinkan aparatur desa untuk menambah field, dataset, dan halaman baru sepenuhnya melalui panel admin tanpa perlu intervensi developer di masa depan. 

## Operating Context
Warga desa mengakses via perangkat mobile maupun desktop untuk mencari informasi dan mengajukan layanan administrasi. Admin (perangkat desa) mengakses via desktop/tablet untuk mengelola data operasional, memproses pengaduan, dan memperbarui informasi.

## Capabilities and Constraints
- **Responsivitas**: Harus sangat responsif (mobile-first untuk publik, desktop-optimized untuk admin).
- **Keamanan**: Proteksi ketat terhadap SQL Injection, XSS, CSRF, rate limiting, validasi server-side (Zod), dan perlindungan identitas pada sistem pengaduan.
- **Koneksi Database**: Menggunakan PostgreSQL (Aiven) dengan limit 20 koneksi, mensyaratkan connection pooling yang efisien dan membatasi koneksi pada saat build maupun runtime (tidak menggunakan Edge Runtime untuk DB).
- **Arsitektur Konten**: Menggabungkan tabel standar (users, berita, pengaduan) dan koleksi dinamis (JSONB) untuk fleksibilitas maksimal (seperti identitas desa, data kependudukan, dataset tambahan).
- **Aksesibilitas**: Target WCAG 2.1 AA.
- **Performa**: Optimasi gambar, caching, dan SEO (Metadata, Open Graph).

## Brand Commitments
Visual yang resmi, bersih, ramah masyarakat, dan modern (tanpa gaya AI generik seperti over-gradient, glassmorphism berlebihan). Menggunakan warna utama hijau (Primary: #166534, Secondary: #2E7D32) yang selaras dengan identitas lokal. Typografi kuat dan hierarki jelas.

## Evidence on Hand
Terdapat dokumen `Struktur-Website-Desa-Cikahuripan.docx` yang memuat struktur menu (Profil, Layanan, EduVillage, Berita, Agenda, Galeri, Pengaduan, Kontak) serta data awal kependudukan, potensi desa, dan tautan layanan Google Form.

## Product Principles
- **Fleksibilitas Admin**: Admin harus dapat menambah variabel/field/dataset secara mandiri.
- **Transparansi & Kepercayaan**: Data dan statistik disajikan dengan visualisasi yang jelas, serta pengaduan yang aman.
- **Clarity over complexity**: Desain UI/UX publik harus inklusif untuk berbagai usia, sedangkan panel admin harus profesional dan mudah dinavigasi.
- **Stabilitas & Skalabilitas**: Teknologi stabil (Next.js, TypeScript strict, PostgreSQL) tanpa dependency yang tidak perlu.

## Accessibility & Inclusion
Harus dapat digunakan oleh masyarakat lansia (teks terbaca, kontras tinggi). Navigasi keyboard, form berlabel, dan alt text untuk gambar adalah kewajiban. Animasi diatur minimal dan menghormati `prefers-reduced-motion`.
