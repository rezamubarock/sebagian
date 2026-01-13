# 🔥 Tutorial Setup Firebase untuk Platform Sebagian

Tutorial lengkap step-by-step untuk mengkonfigurasi Firebase agar platform Sebagian berjalan dengan baik.

---

## 📋 Daftar Isi

1. [Buat Project Firebase](#1-buat-project-firebase)
2. [Aktifkan Authentication](#2-aktifkan-authentication)
3. [Buat Database Firestore](#3-buat-database-firestore)
4. [Setup Security Rules](#4-setup-security-rules-penting)
5. [Dapatkan Config untuk Website](#5-dapatkan-config-untuk-website)
6. [Buat Akun Admin Pertama](#6-buat-akun-admin-pertama)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Buat Project Firebase

1. Buka **[console.firebase.google.com](https://console.firebase.google.com/)**
2. Login dengan akun Google Anda
3. Klik tombol **"Create a project"** atau **"Add project"**

4. **Step 1 - Nama Project:**
   - Masukkan nama: `sebagian-platform`
   - Klik **Continue**

5. **Step 2 - Google Analytics:**
   - Bisa diaktifkan atau tidak (opsional)
   - Klik **Continue**

6. **Step 3 - Konfirmasi:**
   - Klik **Create project**
   - Tunggu hingga selesai (sekitar 30 detik)
   - Klik **Continue**

✅ Project Firebase sudah dibuat!

---

## 2. Aktifkan Authentication

1. Di sidebar kiri, klik **"Build"** → **"Authentication"**
2. Klik tombol **"Get started"**
3. Anda akan melihat tab **"Sign-in method"**

4. **Aktifkan Email/Password:**
   - Klik **"Email/Password"**
   - Toggle **"Enable"** menjadi ON
   - JANGAN aktifkan "Email link (passwordless sign-in)"
   - Klik **"Save"**

✅ Authentication sudah aktif!

---

## 3. Buat Database Firestore

1. Di sidebar kiri, klik **"Build"** → **"Firestore Database"**
2. Klik tombol **"Create database"**

3. **Pilih Mode:**
   - Pilih **"Start in test mode"** ⚠️ (nanti kita ubah rules-nya)
   - Klik **"Next"**

4. **Pilih Lokasi Server:**
   - Pilih lokasi terdekat dengan pengguna Anda
   - Untuk Indonesia: pilih **`asia-southeast2`** (Jakarta)
   - Klik **"Enable"**

5. Tunggu hingga database selesai dibuat

✅ Firestore Database sudah aktif!

---

## 4. Setup Security Rules (PENTING!)

**⚠️ INI LANGKAH PALING PENTING UNTUK KEAMANAN!**

1. Di halaman Firestore, klik tab **"Rules"**
2. Hapus semua isi yang ada
3. Copy-paste rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ==========================================
    // USERS COLLECTION
    // ==========================================
    match /users/{userId} {
      // User bisa baca data dirinya sendiri
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // User bisa buat akun baru (saat register)
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // User bisa update data dirinya (tapi tidak bisa ubah role)
      allow update: if request.auth != null && request.auth.uid == userId
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']));
      
      // Admin bisa baca semua user
      allow read: if request.auth != null 
                  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Admin bisa update semua user (termasuk role)
      allow update: if request.auth != null 
                    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ==========================================
    // PRODUCTS COLLECTION
    // ==========================================
    match /products/{productId} {
      // Semua orang bisa baca produk (untuk landing page)
      allow read: if true;
      
      // Hanya admin yang bisa tambah/edit/hapus produk
      allow write: if request.auth != null 
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ==========================================
    // TRANSACTIONS COLLECTION
    // ==========================================
    match /transactions/{txId} {
      // User bisa baca transaksi miliknya sendiri
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // User bisa buat transaksi baru
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Admin bisa baca dan update semua transaksi
      allow read, update: if request.auth != null 
                          && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ==========================================
    // CONFIG COLLECTION (untuk CMS)
    // ==========================================
    match /config/{docId} {
      // Semua orang bisa baca config (untuk landing page)
      allow read: if true;
      
      // Hanya admin yang bisa edit config
      allow write: if request.auth != null 
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

4. Klik tombol **"Publish"**
5. Tunggu hingga muncul notifikasi "Rules published"

✅ Security Rules sudah diatur dengan aman!

---

## 5. Dapatkan Config untuk Website

1. Di halaman utama Firebase Console (klik logo Firebase di kiri atas)
2. Klik ikon ⚙️ (gear) di sebelah "Project Overview"
3. Pilih **"Project settings"**

4. Scroll ke bawah ke bagian **"Your apps"**
5. Jika belum ada app, klik ikon **"</>"** (Web)

6. **Register App:**
   - App nickname: `Sebagian Web`
   - ❌ JANGAN centang "Firebase Hosting"
   - Klik **"Register app"**

7. **Copy Config:**
   Anda akan melihat kode seperti ini:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "sebagian-platform.firebaseapp.com",
     projectId: "sebagian-platform",
     storageBucket: "sebagian-platform.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

8. **Update file `app.js`:**
   - Buka file `app.js` di project Sebagian
   - Ganti bagian `firebaseConfig` dengan nilai dari Firebase Console
   - Save file

✅ Config sudah terhubung!

---

## 6. Buat Akun Admin Pertama

### Langkah A: Register Akun

1. Buka website Anda: `https://sebagian.com/register.html`
2. Isi form:
   - Nama: (nama Anda)
   - Email: (email Anda)
   - Password: (password Anda)
3. Klik **"Daftar Sekarang"**
4. Cek email Anda, klik link verifikasi
5. Kembali ke website, klik "Saya Sudah Verifikasi"

### Langkah B: Jadikan Admin di Firestore

1. Buka **Firebase Console** → **Firestore Database**
2. Anda akan melihat collection **"users"**
3. Klik collection **"users"**
4. Klik dokumen dengan email Anda
5. Cari field **"role"**
6. Klik ikon ✏️ (edit) di sebelah field "role"
7. Ubah nilainya dari `member` menjadi `admin`
8. Klik **"Update"**

### Langkah C: Test Login Admin

1. Logout dari website (jika sedang login)
2. Login kembali dengan akun yang sama
3. Anda seharusnya diarahkan ke `/admin/index.html`

✅ Akun Admin sudah dibuat!

---

## 7. Troubleshooting

### ❌ Error: "Missing or insufficient permissions"

**Penyebab:** Firestore Rules belum di-publish atau salah.

**Solusi:**
1. Buka **Firestore** → tab **"Rules"**
2. Pastikan rules sudah sesuai dengan yang di atas
3. Klik **"Publish"**

---

### ❌ User tidak tersimpan di Firestore setelah Register

**Penyebab:** Rules tidak mengizinkan user create.

**Solusi:**
1. Pastikan rules untuk `/users/{userId}` ada `allow create`
2. Cek browser Console (F12) untuk error message

---

### ❌ Tidak menerima email verifikasi

**Penyebab:** Email masuk ke folder Spam.

**Solusi:**
1. Cek folder **Spam** atau **Junk**
2. Cari email dari "noreply@sebagian-platform.firebaseapp.com"
3. Klik "Not Spam" agar email berikutnya masuk inbox

---

### ❌ Login berhasil tapi redirect terus-menerus

**Penyebab:** Email belum diverifikasi.

**Solusi:**
1. Cek email dan klik link verifikasi
2. Setelah itu, kembali ke website dan klik "Saya Sudah Verifikasi"

---

### ❌ Sudah jadi Admin tapi tetap redirect ke Member

**Penyebab:** Cache browser atau role belum ter-update.

**Solusi:**
1. Logout
2. Clear cache browser: `Cmd + Shift + Delete` (Mac) atau `Ctrl + Shift + Delete` (Windows)
3. Login kembali

---

### ❌ Website masih menampilkan versi lama

**Penyebab:** Cache Cloudflare.

**Solusi:**
1. Buka **Cloudflare Dashboard**
2. Pilih domain Anda
3. Pergi ke **Caching** → **Configuration**
4. Klik **"Purge Everything"**
5. Tunggu 1-2 menit
6. Hard refresh browser: `Cmd + Shift + R`

---

## ✅ Checklist Akhir

- [ ] Project Firebase sudah dibuat
- [ ] Authentication Email/Password sudah aktif
- [ ] Firestore Database sudah dibuat
- [ ] Security Rules sudah di-publish
- [ ] Config sudah di-copy ke `app.js`
- [ ] Sudah register akun pertama
- [ ] Email sudah diverifikasi
- [ ] Role sudah diubah ke "admin" di Firestore
- [ ] Bisa login ke Admin Dashboard

---

## 🎉 Selamat!

Platform Sebagian Anda sudah siap digunakan!

- **Landing Page:** `https://sebagian.com/`
- **Login:** `https://sebagian.com/login.html`
- **Register:** `https://sebagian.com/register.html`
- **Member Dashboard:** `https://sebagian.com/member/`
- **Admin Dashboard:** `https://sebagian.com/admin/`
