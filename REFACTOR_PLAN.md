# Rencana Perombakan Aplikasi Manajemen Programmer

Dokumen ini merinci analisis dan rencana aksi untuk merombak aplikasi yang ada agar sesuai dengan arsitektur dan fungsionalitas baru yang didefinisikan dalam blueprint.

## 1. Analisis Singkat Proyek Lama

Arsitektur saat ini adalah aplikasi monolitik Node.js dengan backend Express dan frontend vanilla JavaScript yang disajikan secara statis.

**Kekuatan:**

- **Dasar yang Solid:** Sudah menggunakan Express, Mongoose, dan struktur dasar `controllers`, `routes`, `models`.
- **Keamanan Awal:** Telah mengimplementasikan otentikasi (JWT) dan otorisasi berbasis peran (`protect`, `authorize`) melalui middleware, yang merupakan fondasi yang sangat baik.

**Kelemahan Utama:**

- **Skalabilitas Terbatas:** Logika bisnis ditempatkan langsung di dalam _controller_. Seiring bertambahnya kompleksitas, ini akan sulit dikelola dan diuji.
- **Struktur Frontend Kurang Terorganisir:** Menggunakan file JavaScript per halaman (`public/js/pages`) tanpa framework frontend modern seperti React akan menyulitkan pengelolaan state, pembuatan komponen UI yang dapat digunakan kembali, dan pengembangan fitur yang kompleks seperti papan Kanban.
- **Struktur Direktori Backend:** Meskipun fungsional, struktur direktori backend dapat ditingkatkan untuk memisahkan _concerns_ dengan lebih baik (misalnya, memisahkan logika bisnis dari _controller_).

## 2. Proposal Struktur Direktori Baru

Struktur baru ini dirancang untuk memisahkan backend dan frontend dengan jelas, serta mengorganisir setiap bagian secara logis untuk skalabilitas.

### Backend (`/server`)

```
server/
├── config/             # Konfigurasi (database, JWT secret, dll.)
│   └── db.js
├── controllers/        # Menerima request dan mengirim response
│   ├── authController.js
│   ├── userController.js
│   ├── programmerController.js
│   ├── jobController.js
│   └── standbyController.js
├── middleware/         # Middleware (auth, error handling, validation)
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/             # Skema database Mongoose
│   ├── User.js
│   ├── Programmer.js
│   ├── Job.js
│   └── Standby.js
├── routes/             # Definisi endpoint API
│   ├── authRoutes.js
│   └── ... (file rute per modul)
├── services/           # Logika bisnis inti (dipisahkan dari controller)
│   ├── programmerService.js
│   ├── jobService.js
│   └── ... (file service per modul)
├── utils/              # Fungsi bantuan (misal: JWT generator)
│   └── jwtUtils.js
└── server.js           # Entry point aplikasi backend
```

### Frontend (`/client`)

Struktur ini mengasumsikan penggunaan **React**.

```
client/
├── public/
│   └── index.html      # Template HTML utama
├── src/
│   ├── api/            # Fungsi untuk memanggil backend API (misal: menggunakan Axios)
│   │   ├── authApi.js
│   │   └── programmerApi.js
│   ├── components/     # Komponen UI kecil yang dapat digunakan kembali
│   │   ├── common/       # Tombol, Input, Modal, dll.
│   │   ├── layout/       # Navbar, Sidebar, Footer
│   │   └── specific/     # KanbanCard.js, ProfileForm.js, UserTable.js
│   ├── context/        # State management global (React Context atau Zustand/Redux)
│   │   └── AuthContext.js
│   ├── hooks/          # Custom hooks (misal: useAuth, useFetchData)
│   │   └── useAuth.js
│   ├── pages/          # Komponen untuk setiap halaman/rute
│   │   ├── DashboardPage.js
│   │   ├── ProfilePage.js
│   │   ├── ProgrammersPage.js
│   │   ├── JobsPage.js
│   │   └── StandbyPage.js
│   ├── routes/         # Konfigurasi routing frontend (React Router)
│   │   └── AppRouter.js
│   ├── styles/         # File CSS global atau styling config
│   └── App.js          # Komponen root aplikasi React
└── package.json
```

## 3. Rencana Migrasi & Perombakan (Langkah-demi-Langkah)

### A. Database Models

Skema `User` dan `Programmer` Anda sudah sangat sesuai dengan blueprint. Perubahan yang diperlukan minimal.

1.  **Model `User.js`:** Tidak perlu diubah. Strukturnya sudah sempurna.
2.  **Model `Programmer.js`:**
    - Hapus field `phone` karena tidak ada di blueprint.
    - Pastikan semua field lain (`user`, `nim`, `jurusan`, `skill`, `status`) sesuai dengan tipe data yang diharapkan.
3.  **Model `Job.js` & `Standby.js`:** Buat file model baru ini persis seperti yang didefinisikan dalam blueprint.

### B. Backend Logic

1.  **Struktur Direktori:** Buat struktur direktori baru di dalam folder `server/` seperti yang diusulkan di atas (`config`, `services`, `utils`).
2.  **Services Layer:**

    - Buat file `services/programmerService.js`.
    - Pindahkan semua logika manipulasi data dari `controllers/programmersController.js` ke dalam `programmerService.js`.
    - **Contoh di `programmerService.js`:**

      ```javascript
      exports.getAll = async () => {
        return await Programmer.find().populate("user", "name email");
      };

      exports.create = async (programmerData) => {
        const newProgrammer = new Programmer(programmerData);
        return await newProgrammer.save();
      };
      // ... fungsi lainnya
      ```

    - **Controller menjadi lebih ramping:** Controller sekarang hanya bertugas memanggil service dan mengirim respons.

      ```javascript
      // controllers/programmersController.js (setelah refactor)
      const programmerService = require("../services/programmerService");

      exports.getAllProgrammers = async (req, res, next) => {
        try {
          const programmers = await programmerService.getAll();
          res.status(200).json(programmers);
        } catch (error) {
          next(error); // Teruskan error ke middleware error handling
        }
      };
      ```

3.  **Routes:** Struktur rute saat ini sudah bagus. Pertahankan pemisahan file per modul (`programmers.js`, `jobs.js`, dll.). Pastikan setiap rute memanggil fungsi controller yang benar.
4.  **Autentikasi & RBAC:**
    - **Middleware `authMiddleware.js`:** Logika `protect` (verifikasi JWT) dan `authorize` (pengecekan peran) Anda sudah tepat. Ini adalah kode yang dapat dipertahankan sepenuhnya.
    - **Penerapan:** Terus terapkan middleware ini pada file-file rute seperti yang sudah Anda lakukan. Ini sudah sesuai dengan praktik terbaik.

### C. Frontend Logic (Asumsi menggunakan React)

1.  **Inisialisasi Proyek React:** Buat proyek React baru di dalam direktori `client/` menggunakan `npx create-react-app client`.
2.  **Halaman (Pages):** Buat file komponen untuk setiap modul di `src/pages/`. Contoh: `JobsPage.js` akan berisi papan Kanban, `ProgrammersPage.js` akan berisi tabel data programmer.
3.  **Komponen (Components):**
    - Identifikasi elemen UI yang berulang dan buat komponen di `src/components/`.
    - **Contoh komponen yang bisa dibuat:**
      - `KanbanCard.js`: Untuk menampilkan satu pekerjaan di papan Kanban.
      - `ProfileForm.js`: Form untuk mengedit data user dan programmer.
      - `UserTable.js`: Tabel untuk menampilkan data programmer (digunakan di `ProgrammersPage.js`).
      - `Navbar.js`, `Sidebar.js`: Komponen layout utama.
4.  **Manajemen State:**
    - Gunakan **React Context API** untuk manajemen state autentikasi.
    - Buat `src/context/AuthContext.js`.
    - Context ini akan menyimpan informasi pengguna yang login (`user`), token JWT, dan status loading.
    - Buat custom hook `useAuth()` di `src/hooks/useAuth.js` untuk mempermudah akses ke context ini dari komponen mana pun.
5.  **Routing:** Gunakan `react-router-dom` untuk mengatur navigasi antar halaman di `src/routes/AppRouter.js`. Implementasikan _protected routes_ yang hanya bisa diakses setelah login.

## 4. Identifikasi Kode yang Dapat Dipertahankan

Anda tidak perlu memulai dari nol. Banyak bagian dari proyek lama yang bisa langsung digunakan.

- **`models/*.js`:** Semua skema Mongoose Anda (dengan sedikit modifikasi pada `Programmer.js`) dapat digunakan kembali.
- **`middleware/authMiddleware.js`:** Ini adalah bagian paling berharga. Logika `protect` dan `authorize` sudah solid dan tidak perlu diubah.
- **`config/db.js` (jika ada):** Logika koneksi database Mongoose di `app.js` dapat dipindahkan ke file ini dan digunakan kembali.
- **`routes/*.js`:** Struktur file rute sudah modular dan bisa dipertahankan. Anda hanya perlu menyesuaikan panggilan ke fungsi controller yang baru.
- **`.env`:** File environment variables Anda tetap valid.

## 5. Ringkasan Rencana Aksi (Checklist)

Berikut adalah urutan pekerjaan yang direkomendasikan untuk pengembang:

**Fase 1: Backend Refactoring**

1.  [ ] Buat struktur direktori baru untuk backend di dalam folder `server/`.
2.  [ ] Pindahkan file-file yang ada (`models`, `routes`, `controllers`, `middleware`) ke dalam `server/`.
3.  [ ] Buat direktori `server/services` dan `server/utils`.
4.  [ ] Modifikasi model `Programmer.js` (hapus `phone`).
5.  [ ] Buat model baru untuk `Job.js` dan `Standby.js`.
6.  [ ] Buat `programmerService.js` dan pindahkan logika dari `programmersController.js`.
7.  [ ] Refactor `programmersController.js` untuk memanggil `programmerService`.
8.  [ ] Terapkan pola service-controller yang sama untuk modul `jobs`, `standby`, dan `user`.
9.  [ ] Buat middleware `errorMiddleware.js` untuk menangani error secara terpusat.
10. [ ] Update `server.js` (sebelumnya `app.js`) untuk menggunakan struktur baru dan middleware error.

**Fase 2: Frontend Development (React)** 11. [ ] Inisialisasi proyek React baru di direktori `client/`. 12. [ ] Hapus file-file frontend lama di `public/` dan `views/`. Pindahkan `index.html` ke `client/public/`. 13. [ ] Atur `proxy` di `client/package.json` untuk mengarahkan permintaan API ke backend (`"proxy": "http://localhost:5000"`). 14. [ ] Buat `AuthContext` untuk manajemen state pengguna. 15. [ ] Implementasikan `AppRouter.js` dengan `react-router-dom`, termasuk rute publik (Login) dan rute terproteksi. 16. [ ] Buat komponen layout (Navbar, Sidebar). 17. [ ] Buat halaman (pages) untuk setiap fitur (Dashboard, Jobs, dll.). 18. [ ] Buat komponen spesifik (`KanbanCard`, `UserTable`, dll.). 19. [ ] Buat fungsi API call di `src/api/` untuk berinteraksi dengan backend. 20. [ ] Hubungkan UI dengan state dan API.

**Fase 3: Finalisasi & Testing** 21. [ ] Lakukan pengujian menyeluruh untuk setiap fitur (CRUD, otorisasi peran). 22. [ ] Pastikan alur data dari frontend ke backend berjalan lancar. 23. [ ] Perbaiki bug dan lakukan optimasi.
