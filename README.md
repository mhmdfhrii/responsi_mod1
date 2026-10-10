# Library Loan API - Pencatatan Peminjaman Buku Perpustakaan

REST API sederhana untuk mencatat peminjaman buku perpustakaan oleh anggota. Dibangun dengan **Node.js**, **Express.js**, dan **Supabase** (PostgreSQL), lalu di-deploy ke **Vercel**. Proyek ini dibuat untuk Responsi Praktikum Pemrograman Perangkat Bergerak (PPB) 2026.

## Tujuan Proyek

- Menyediakan operasi **CRUD** untuk data peminjaman buku (`/loans`).
- Mendukung **filter query**, misalnya `GET /loans?status=Terlambat`.
- Menyediakan data pendukung: anggota (`/members`) dan buku (`/books`).
- Status `Dipinjam` otomatis berubah menjadi `Terlambat` jika sudah melewati `due_date`.

## Link Deployment

- **Base URL (Vercel):** `https://GANTI-DENGAN-LINK-VERCEL-KAMU.vercel.app`
- **Repository GitHub:** `https://github.com/GANTI-USERNAME/GANTI-NAMA-REPO`

## Struktur Data / Schema

```
members (1) ───< loans >─── (1) books
```

**members**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | otomatis |
| name | text | wajib |
| email | text | unik |
| phone | text | |
| address | text | |
| created_at | timestamptz | otomatis |

**books**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | otomatis |
| isbn | text | unik |
| title | text | wajib |
| author | text | wajib |
| publisher | text | |
| year | integer | 1000-2100 |
| created_at | timestamptz | otomatis |

**loans**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | otomatis |
| member_id | uuid (FK -> members) | wajib |
| book_id | uuid (FK -> books) | wajib |
| loan_date | date | default hari ini |
| due_date | date | default `loan_date` + 7 hari |
| return_date | date | diisi saat buku dikembalikan |
| status | text | `Dipinjam` / `Dikembalikan` / `Terlambat` |
| notes | text | opsional |
| created_at | timestamptz | otomatis |

SQL lengkap (beserta data contoh) ada di [`sql/schema.sql`](sql/schema.sql).

## Daftar Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/loans` | Semua peminjaman (filter: `status`, `member_id`, `book_id`) |
| GET | `/loans/:id` | Detail satu peminjaman |
| POST | `/loans` | Tambah peminjaman |
| PUT | `/loans/:id` | Ubah peminjaman (termasuk pengembalian buku) |
| DELETE | `/loans/:id` | Hapus peminjaman |
| GET/POST | `/books`, `/members` | Daftar / tambah buku & anggota |
| GET/PUT/DELETE | `/books/:id`, `/members/:id` | Detail / ubah / hapus |

## Contoh Request dan Response

### 1. GET /loans?status=Terlambat

```http
GET /loans?status=Terlambat
```

Response `200 OK`:

```json
[
  {
    "id": "5d1e2c7a-8f0b-4f6e-9b61-0a3c7f2d1e11",
    "loan_date": "2026-09-20",
    "due_date": "2026-10-04",
    "return_date": null,
    "status": "Terlambat",
    "notes": null,
    "created_at": "2026-09-20T03:10:00.000Z",
    "members": { "id": "a1...", "name": "Siti Aminah", "email": "siti@example.com" },
    "books": { "id": "b2...", "title": "Bumi Manusia", "author": "Pramoedya Ananta Toer" }
  }
]
```

### 2. POST /loans

```http
POST /loans
Content-Type: application/json

{
  "member_id": "<uuid anggota>",
  "book_id": "<uuid buku>",
  "due_date": "2026-10-20",
  "notes": "Pinjam untuk tugas"
}
```

Response `201 Created`:

```json
{
  "id": "c3f9...",
  "loan_date": "2026-10-10",
  "due_date": "2026-10-20",
  "return_date": null,
  "status": "Dipinjam",
  "notes": "Pinjam untuk tugas",
  "members": { "id": "...", "name": "Budi Santoso", "email": "budi@example.com" },
  "books": { "id": "...", "title": "Laskar Pelangi", "author": "Andrea Hirata" }
}
```

> `loan_date` default hari ini, `due_date` default 7 hari setelah `loan_date`.

### 3. PUT /loans/:id (pengembalian buku)

```http
PUT /loans/<id>
Content-Type: application/json

{ "status": "Dikembalikan" }
```

Response `200 OK`: data peminjaman dengan `status: "Dikembalikan"` dan `return_date` terisi otomatis dengan tanggal hari ini.

### 4. DELETE /loans/:id

Response `200 OK`:

```json
{ "message": "Peminjaman berhasil dihapus" }
```

### 5. Contoh Error

| Kondisi | Status | Response |
|---|---|---|
| Filter status tidak valid | 400 | `{ "error": "status harus salah satu dari: Dipinjam, Dikembalikan, Terlambat" }` |
| `member_id` / `book_id` kosong | 400 | `{ "error": "member_id dan book_id wajib diisi" }` |
| ID tidak ditemukan | 404 | `{ "error": "Data peminjaman tidak ditemukan" }` |
| Data duplikat (mis. email/ISBN) | 409 | `{ "error": "..." }` |

## Panduan Instalasi dan Menjalankan Lokal

**Prasyarat:** Node.js 18+, akun [Supabase](https://supabase.com), Git, dan Postman (untuk uji endpoint).

1. **Clone repository**
   ```bash
   git clone https://github.com/GANTI-USERNAME/GANTI-NAMA-REPO.git
   cd GANTI-NAMA-REPO
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Siapkan database Supabase**
   - Buat project baru di Supabase.
   - Buka **SQL Editor -> New query**, tempel isi `sql/schema.sql`, lalu **Run**.

4. **Konfigurasi environment variables**
   ```bash
   cp .env.example .env
   ```
   Isi `SUPABASE_URL` dan `SUPABASE_KEY` (anon public key) dari **Project Settings -> API**.

5. **Jalankan server**
   ```bash
   npm run dev     # development (nodemon)
   npm start       # production
   ```
   API berjalan di `http://localhost:3000`.

## Deployment ke Vercel

1. Push repository ke GitHub (file `.env` tidak ikut karena sudah di `.gitignore`).
2. Di [vercel.com](https://vercel.com), **Add New -> Project**, lalu import repository.
3. Pada **Environment Variables**, tambahkan `SUPABASE_URL` dan `SUPABASE_KEY`.
4. Klik **Deploy**. Pastikan Base URL yang dihasilkan sudah ditaruh di bagian "Link Deployment" di atas.

## Struktur Folder

```
├── sql/schema.sql          # query pembuatan tabel + data contoh
├── src/
│   ├── config/             # koneksi Supabase
│   ├── controllers/        # logika request/response
│   ├── models/             # query ke Supabase
│   ├── routes/             # definisi endpoint
│   ├── utils/              # helper tanggal & error
│   └── index.js            # entry point Express
├── .env.example            # template environment variable
├── vercel.json             # konfigurasi Vercel
└── package.json
```
