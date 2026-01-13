# Tutorial Deployment ke Cloudflare Pages & Workers

Panduan ini akan membantu Anda menghubungkan repository GitHub `sebagian` ke **Cloudflare Pages** (untuk hosting website) dan **Cloudflare Workers** (untuk backend/fungsi serverless).

## Bagian 1: Menghubungkan ke Cloudflare Pages (Hosting)

Ini akan membuat website Anda online dengan performa sangat cepat (CDN Cloudflare) dan gratis HTTPS.

1.  **Login ke Cloudflare**
    *   Buka [dash.cloudflare.com](https://dash.cloudflare.com) dan login/daftar.

2.  **Buat Project Pages Baru**
    *   Di menu sebelah kiri, klik **Workers & Pages**.
    *   Klik tombol biru **Create application**.
    *   Pilih tab **Pages**.
    *   Klik **Connect to Git**.

3.  **Hubungkan Repository**
    *   Jika belum, Anda akan diminta login ke GitHub via Cloudflare.
    *   Pilih repository **`sebagian`**.
    *   Klik **Begin setup**.

4.  **Konfigurasi Build**
    *   **Project name**: Biarkan default (misal: `sebagian`).
    *   **Production branch**: `main`.
    *   **Framework preset**: Pilih **None** (karena ini HTML/CSS/JS murni).
    *   **Build command**: Kosongkan.
    *   **Build output directory**: Kosongkan (atau isi `.` jika diminta).
    *   Klik **Save and Deploy**.

5.  **Selesai!**
    *   Tunggu proses "Building" selesai (sekitar 1 menit).
    *   Anda akan mendapatkan URL unik (contoh: `https://sebagian.pages.dev`).

---

## Bagian 2: Menambahkan Cloudflare Workers (Backend)

Jika Anda ingin website Anda punya fitur dinamis (misal: kirim email, simpan data, API), gunakan **Pages Functions** (fitur Cloudflare yang menggunakan teknologi Workers tapi langsung terintegrasi di folder repo).

### Cara Menambahkan API (Worker)

1.  **Di Komputer Anda ( Lokal )**
    *   Buat folder baru bernama `functions` di dalam folder project `sebagian`.
    *   Buat file `hello.js` di dalamnya.

    Folder structure:
    ```text
    sebagian/
    ├── index.html
    ├── style.css
    ├── functions/      <-- Folder kusus Cloudflare
    │   └── hello.js    <-- Ini akan jadi API endpoint
    ```

2.  **Isi File `functions/hello.js`**
    
    ```javascript
    // functions/hello.js
    export async function onRequest(context) {
      return new Response("Halo dari Cloudflare Worker!", {
        headers: { "content-type": "text/plain" }
      });
    }
    ```

3.  **Push ke GitHub**
    *   Jalankan script `git_sync.command` Anda.
    *   Pilih menu **Push**.

4.  **Cek Hasilnya**
    *   Cloudflare akan otomatis mendeteksi folder `functions` dan men-deploy Worker.
    *   Buka website Anda di browser dan tambahkan `/hello` di belakang URLnya.
    *   Contoh: `https://sebagian.pages.dev/hello`
    *   Anda akan melihat pesan teks dari worker.

---

## Tips Tambahan

*   **Custom Domain**: Di dashboard Cloudflare Pages, buka tab **Custom domains** untuk menghubungkan domain `.com` atau `.id` Anda sendiri.
*   **Analytics**: Aktifkan **Web Analytics** di dashboard untuk melihat pengunjung website.
