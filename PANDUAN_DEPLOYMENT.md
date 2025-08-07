# Panduan Deployment Aplikasi MERN

Dokumen ini memberikan panduan lengkap untuk men-deploy aplikasi MERN (MongoDB, Express, React, Node.js) ke lingkungan produksi menggunakan MongoDB Atlas untuk database, Render.com untuk backend, dan Vercel untuk frontend.

---

## 1. Konfigurasi Variabel Lingkungan

Variabel lingkungan (environment variables) digunakan untuk mengelola konfigurasi aplikasi tanpa harus mengubah kode. Ini sangat penting untuk keamanan dan fleksibilitas.

### Backend (`/server/.env`)

Buat file `.env` di direktori root folder `server`.

```env
# Port server akan berjalan
PORT=8000

# URI Koneksi ke MongoDB Atlas
# Ganti dengan connection string dari akun MongoDB Atlas Anda
MONGO_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

# Kunci rahasia untuk menandatangani JSON Web Tokens (JWT)
# Ganti dengan string acak yang sangat kuat dan rahasia
JWT_SECRET="your_super_secret_and_random_jwt_key"

# Mode lingkungan, harus 'production' saat deployment
NODE_ENV=production
```

**Penjelasan:**

- **`PORT`**: Port yang akan digunakan oleh server Node.js. Render.com biasanya menyediakan ini secara otomatis, tetapi baik untuk didefinisikan.
- **`MONGO_URI`**: _Connection string_ untuk menghubungkan aplikasi ke database MongoDB Atlas Anda.
- **`JWT_SECRET`**: Kunci rahasia yang digunakan untuk enkripsi token otentikasi. **Jangan pernah** membagikan nilai ini secara publik.
- **`NODE_ENV`**: Mengatur lingkungan ke `production` akan mengaktifkan optimisasi dan menonaktifkan pesan _debug_ yang tidak perlu.

### Frontend (`/client/.env`)

Buat file `.env` di direktori root folder `client`.

```env
# URL tempat backend di-deploy
# Ganti dengan URL backend dari Render.com setelah di-deploy
REACT_APP_API_URL="https://your-backend-app-name.onrender.com"
```

**Penjelasan:**

- **`REACT_APP_API_URL`**: URL dasar tempat API backend Anda dapat diakses. Aplikasi React akan menggunakan variabel ini untuk mengirim permintaan ke server.

---

## 2. Skrip Build Produksi

Pastikan `package.json` di kedua direktori (`server` dan `client`) memiliki skrip yang benar.

### Root (`/package.json`)

Skrip `start` akan digunakan oleh Render.com untuk menjalankan server Anda dari direktori root.

```json
{
  "name": "web-programmer-scheduler",
  "version": "2.0.0",
  "main": "server/server.js",
  "scripts": {
    "start": "node server/server.js",
    "dev": "nodemon server/server.js"
  },
  "dependencies": {
    // ... dependensi lainnya
  }
}
```

### Frontend (`/client/package.json`)

Skrip `build` akan digunakan oleh Vercel untuk membuat versi statis dari aplikasi React Anda.

```json
{
  "name": "client",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    // ... dependensi lainnya
  }
}
```

---

## 3. Checklist Panduan Deployment

Ikuti langkah-langkah ini secara berurutan untuk men-deploy aplikasi Anda.

### A. Database: MongoDB Atlas

1.  **Buat Akun dan Cluster Gratis:**

    - Buka [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) dan daftar akun baru.
    - Setelah masuk, buat _organization_ dan _project_ baru.
    - Pilih **"Build a Database"** dan pilih plan **M0 (Free Tier)**.
    - Pilih penyedia cloud dan region yang paling dekat dengan pengguna Anda (misalnya, AWS, Singapore `ap-southeast-1`).
    - Biarkan pengaturan tambahan sebagai default dan klik **"Create Cluster"**. Proses ini mungkin memakan waktu beberapa menit.

2.  **Dapatkan Connection String (URI):**

    - Setelah cluster dibuat, klik **"Connect"**.
    - Pilih **"Drivers"**.
    - Pilih **Node.js** sebagai driver Anda dan versi terbaru.
    - Salin _connection string_ yang ditampilkan. Ini adalah `MONGO_URI` Anda.
    - Ganti `<password>` dengan kata sandi pengguna database yang akan Anda buat di langkah berikutnya.

3.  **Konfigurasi Akses Jaringan:**
    - Di menu sebelah kiri, navigasikan ke **"Network Access"**.
    - Klik **"Add IP Address"**.
    - Pilih **"ALLOW ACCESS FROM ANYWHERE"** (0.0.0.0/0). Ini memungkinkan server Anda (dari Render.com) untuk terhubung ke database.
    - Klik **"Confirm"**.
    - Di menu sebelah kiri, navigasikan ke **"Database Access"**.
    - Klik **"Add New Database User"**.
    - Buat nama pengguna dan kata sandi yang kuat. Simpan kata sandi ini untuk digunakan di `MONGO_URI`.
    - Berikan hak akses **"Read and write to any database"**.
    - Klik **"Add User"**.

### B. Backend: Render.com

1.  **Buat Akun dan Hubungkan Git:**

    - Buka [Render.com](https://render.com/) dan daftar menggunakan akun GitHub, GitLab, atau Bitbucket Anda.
    - Pastikan kode proyek Anda sudah di-push ke repositori Git.

2.  **Buat Web Service Baru:**

    - Di dashboard Render, klik **"New +"** dan pilih **"Web Service"**.
    - Hubungkan Render ke repositori Git Anda dan pilih repositori proyek.
    - Berikan nama unik untuk layanan Anda (misalnya, `my-scheduler-api`).

3.  **Konfigurasi Web Service:**

    - **Root Directory**: Biarkan kosong (ini akan menggunakan root repositori).
    - **Environment**: `Node`.
    - **Region**: Pilih region yang sama atau terdekat dengan cluster MongoDB Anda.
    - **Branch**: `main` atau branch utama Anda.
    - **Build Command**: `npm install` (atau `yarn install`).
    - **Start Command**: `npm start` (atau `yarn start`). Perintah ini akan menjalankan `node server/server.js` sesuai isi `package.json`.

4.  **Atur Variabel Lingkungan:**

    - Buka bagian **"Environment"**.
    - Klik **"Add Environment Variable"** dan tambahkan variabel yang telah Anda siapkan di `server/.env`:
      - `MONGO_URI`: Tempel _connection string_ dari MongoDB Atlas.
      - `JWT_SECRET`: Masukkan kunci rahasia Anda.
      - `NODE_ENV`: `production`.
      - `PORT`: `8000` (Render akan menimpanya jika perlu, tetapi ini adalah praktik yang baik).

5.  **Deploy:**
    - Klik **"Create Web Service"**. Render akan mulai membangun dan men-deploy backend Anda.
    - Setelah selesai, salin URL aplikasi Anda (misalnya, `https://my-scheduler-api.onrender.com`). Anda akan membutuhkannya untuk frontend.

### C. Frontend: Vercel

1.  **Buat Akun dan Hubungkan Git:**

    - Buka [Vercel.com](https://vercel.com/) dan daftar menggunakan akun Git Anda.

2.  **Buat Proyek Baru:**

    - Di dashboard Vercel, klik **"Add New..."** dan pilih **"Project"**.
    - Impor repositori Git yang sama dengan yang Anda gunakan untuk Render.

3.  **Konfigurasi Proyek:**

    - **Framework Preset**: Vercel akan secara otomatis mendeteksi **"Create React App"**.
    - **Root Directory**: `client` (karena kode frontend ada di subdirektori).
    - Biarkan pengaturan build dan output sebagai default.

4.  **Atur Variabel Lingkungan:**

    - Buka tab **"Environment Variables"**.
    - Tambahkan variabel berikut:
      - **Name**: `REACT_APP_API_URL`
      - **Value**: Tempel URL backend dari Render.com yang Anda salin sebelumnya.

5.  **Deploy:**
    - Klik **"Deploy"**. Vercel akan membangun dan men-deploy aplikasi React Anda.
    - Setelah selesai, Anda akan mendapatkan URL publik untuk mengakses aplikasi Anda.

---

**Selesai!** Aplikasi Anda sekarang sudah live di internet.
