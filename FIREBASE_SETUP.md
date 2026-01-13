# Panduan Setup Firebase untuk Sebagian Platform

## Langkah 1: Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add Project"** atau **"Create a project"**
3. Beri nama project (contoh: `sebagian-platform`)
4. Ikuti wizard sampai selesai

## Langkah 2: Aktifkan Authentication

1. Di sidebar Firebase Console, klik **"Authentication"**
2. Klik **"Get Started"**
3. Di tab **"Sign-in method"**, aktifkan **"Email/Password"**
4. Klik **Save**

## Langkah 3: Buat Firestore Database

1. Di sidebar, klik **"Firestore Database"**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"** (untuk development)
4. Pilih lokasi server terdekat (contoh: `asia-southeast2` untuk Jakarta)
5. Klik **"Enable"**

## Langkah 4: Dapatkan Firebase Config

1. Di Firebase Console, klik ikon **⚙️ (gear)** > **"Project settings"**
2. Scroll ke bawah ke bagian **"Your apps"**
3. Klik **"Add app"** > pilih **Web** (ikon `</>`)
4. Beri nickname (contoh: `Sebagian Web`)
5. Klik **"Register app"**
6. Copy konfigurasi yang muncul:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## Langkah 5: Update app.js

1. Buka file `app.js` di project Sebagian
2. Ganti `firebaseConfig` dengan nilai dari langkah 4
3. Save file

## Langkah 6: Buat Admin User

1. Buka website dan **Register** dengan akun baru
2. Buka **Firebase Console > Firestore Database**
3. Cari collection `users`
4. Klik dokumen user yang baru dibuat
5. Ubah field `role` dari `"member"` menjadi `"admin"`
6. Klik **Save**
7. Sekarang akun tersebut bisa akses `/admin/`

## Langkah 7: (Opsional) Atur Firestore Rules

Untuk keamanan production, update **Firestore Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users: Read own, admin reads all
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products: Public read, admin write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Transactions: User reads own, admin reads all
    match /transactions/{txId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Config: Public read, admin write
    match /config/{docId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Selesai!

Platform Anda sudah siap digunakan:
- Landing page: `/index.html`
- Login: `/login.html`
- Register: `/register.html`
- Member Dashboard: `/member/index.html`
- Admin Dashboard: `/admin/index.html`
