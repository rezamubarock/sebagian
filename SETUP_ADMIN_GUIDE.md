# Panduan Setup Admin Dashboard & KV

Fitur Admin memerlukan konfigurasi tambahan di Cloudflare Dashboard agar bisa berjalan (menyimpan data dan password).

## Langkah 1: Setup KV (Database)

1.  Login ke [dash.cloudflare.com](https://dash.cloudflare.com).
2.  Masuk ke menu **Workers & Pages** > **KV**.
3.  Klik **Create a Namespace**.
4.  Beri nama: `sebagian-content` (atau bebas).
5.  Klik **Add**.

## Langkah 2: Hubungkan KV ke Project Pages

1.  Masuk ke menu **Workers & Pages**.
2.  Klik project `sebagian` Anda.
3.  Pergi ke **Settings** > **Functions**.
4.  Scroll ke bagian **KV Namespace Bindings.**
5.  Klik **Add binding**.
    *   **Variable name**: `SITE_CONTENT` (WAJIB PERSIS INI).
    *   **KV namespace**: Pilih `sebagian-content` yang tadi dibuat.
6.  Klik **Save**.

## Langkah 3: Setup Password Admin

1.  Masih di **Settings** (project pages).
2.  Pilih menu **Environment variables**.
3.  Klik **Add variable** (Production).
    *   **Variable name**: `ADMIN_PASSWORD`
    *   **Value**: Masukkan password rahasia Anda (contoh: `kopi123`).
    *   (Opsional) Klik **Encrypt** agar aman.
4.  Klik **Save**.

## Langkah 4: Re-deploy (PENTING)

Setelah mengubah setting di atas, Anda harus melakukan deployment ulang agar efeknya terasa.
1.  Buka tab **Deployments**.
2.  Klik titik tiga (...) di deployment terakhir (paling atas).
3.  Pilih **Retry deployment**.

---

## Cara Menggunakan

1.  Buka `https://sebagian.pages.dev/admin`.
2.  Login dengan password yang Anda set di Langkah 3.
3.  Anda akan diarahkan ke Dashboard.
4.  Ubah teks "Hero Title" atau "Footer".
5.  Klik Simpan.
6.  Buka halaman utama `https://sebagian.pages.dev/` untuk melihat perubahannya!
