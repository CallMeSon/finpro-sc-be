# REST API Pemesanan Tiket Konser JMK48

Backend REST API untuk mengelola pemesanan tiket konser JMK48: data pemesan, kategori tiket, jumlah tiket, lineup performer, dan status pembayaran. Dibangun dengan Node.js + ExpressJS dan MongoDB Atlas sebagai penyimpanan permanen.

## Tech Stack

| Komponen | Fungsi |
|---|---|
| Node.js | Runtime JavaScript di sisi server |
| ExpressJS 5 | HTTP server, routing, middleware JSON |
| MongoDB Atlas + Mongoose | Database NoSQL dan ODM (schema + validasi) |
| dotenv | Memuat variabel dari `.env` ke `process.env` |
| nodemon | Auto-restart server saat file berubah (development) |

## Struktur Folder

```
final-project/
├── config/
│   └── db.js                     # koneksi Mongoose ke MongoDB Atlas
├── controllers/
│   └── ticketControllers.js      # logika CRUD + HTTP status code
├── models/
│   └── Ticket.js                 # schema & validasi data tiket
├── routes/
│   └── ticketRoutes.js           # pemetaan endpoint ke controller
├── .env                          # variabel rahasia (tidak di-commit)
├── index.js                      # entry point server
└── package.json
```

## Cara Menjalankan

1. Install dependency:

   ```
   npm install
   ```

2. Buat file `.env` di root project:

   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
   ```

3. Jalankan server (development):

   ```
   npm run dev
   ```

4. Server aktif di `http://localhost:5000`. Cek dengan membuka root endpoint:

   ```
   GET http://localhost:5000/
   ```

   Response:
   ```json
   {
     "message": "Selamat dateng ke sistem pemesanan ticket konser JMK48!",
     "status": "server nyala"
   }
   ```

## Daftar Endpoint

Base URL: `http://localhost:5000`

| Method | Endpoint | Fungsi | Status Sukses | Status Error |
|---|---|---|---|---|
| POST | `/api/tickets` | Membuat pemesanan tiket baru | 201 Created | 400 Bad Request |
| GET | `/api/tickets` | Mengambil seluruh data tiket | 200 OK | 500 Internal Server Error |
| GET | `/api/tickets/:id` | Mengambil satu tiket berdasarkan ID | 200 OK | 404 Not Found, 400 Bad Request |
| PUT | `/api/tickets/:id` | Memperbarui data tiket | 200 OK | 404 Not Found, 400 Bad Request |
| DELETE | `/api/tickets/:id` | Menghapus data tiket | 200 OK | 404 Not Found, 400 Bad Request |
| GET | `/` | Cek server aktif | 200 OK | - |

## Nilai Field yang Valid

| Field | Tipe | Aturan |
|---|---|---|
| `namaPemesan` | String | wajib, spasi awal/akhir dibuang |
| `emailPemesan` | String | wajib, spasi awal/akhir dibuang |
| `kategoriTicket` | String | wajib, salah satu: `VVIP`, `VIP`, `Orang Biasa` |
| `jumlahTicket` | Number | wajib, minimal 1, maksimal 5 |
| `totalHarga` | Number | wajib (dihitung server, client tidak perlu mengirim) |
| `lineupGroup` | String | wajib, `Lineup Ngawi (Lil nus nus, Mas Amba, Rusdi)` atau `Lineup Oslo (Fuad, Rehan, Mr Ironi)` |
| `statusPembayaran` | String | `bayar dulu mpruy` (default), `dana masuk boskyuh`, `cancelled` |

Harga satuan yang dihitung server: `VVIP` = 1.500.000, `VIP` = 900.000, `Orang Biasa` = 450.000. `totalHarga` = harga satuan × `jumlahTicket`. Saat PUT mengubah `kategoriTicket` atau `jumlahTicket`, `totalHarga` dihitung ulang otomatis; `totalHarga` yang dikirim client diabaikan.

## Contoh Request

### 1. Create (POST /api/tickets)

Body (JSON):

```json
{
  "namaPemesan": "Gerson",
  "emailPemesan": "gerson@mail.com",
  "kategoriTicket": "VVIP",
  "jumlahTicket": 2,
  "lineupGroup": "Lineup Ngawi (Lil nus nus, Mas Amba, Rusdi)"
}
```

Response `201 Created`:

```json
{
  "success": true,
  "message": "woke, dana masuk boskyuh",
  "data": {
    "_id": "6af9bf21d1b54b6c0b820390",
    "namaPemesan": "Gerson",
    "emailPemesan": "gerson@mail.com",
    "kategoriTicket": "VVIP",
    "jumlahTicket": 2,
    "totalHarga": 3000000,
    "lineupGroup": "Lineup Ngawi (Lil nus nus, Mas Amba, Rusdi)",
    "statusPembayaran": "bayar dulu mpruy"
  }
}
```

### 2. Read semua (GET /api/tickets)

```json
{
  "success": true,
  "count": 1,
  "data": [ { "_id": "...", "namaPemesan": "Gerson" } ]
}
```

### 3. Update (PUT /api/tickets/:id)

Body:

```json
{
  "statusPembayaran": "dana masuk boskyuh"
}
```

### 4. Delete (DELETE /api/tickets/:id)

Response `200 OK`:

```json
{
  "success": true,
  "message": "Ticket udah dihapus, bye bye"
}
```

## Contoh Response Error

Validasi gagal (`400`):

```json
{
  "success": false,
  "message": "nipu kah?",
  "error": ["Nama Wajib oey"]
}
```

ID tidak ditemukan (`404`):

```json
{
  "success": false,
  "message": "Ticket nya gaada bos, cek lagi ID nya"
}
```

Format ID tidak valid (`400`):

```json
{
  "success": false,
  "message": "ID nya ngawur nih, formatnya salah",
  "error": "Cast to ObjectId failed for value \"123\" ..."
}
```

## Testing dengan Postman

Import file `JMK48-Ticket-API.postman_collection.json` (ada di root project) ke Postman (File → Import). Variable `baseUrl` sudah berisi `http://localhost:5000`; isi variable `ticketId` dengan `_id` hasil POST. Jalankan request berurutan:

1. `POST /api/tickets` → simpan `_id` dari response, harapan `201`.
2. `GET /api/tickets` → harapan `200` dan `count` bertambah.
3. `GET /api/tickets/:id` → pakai `_id` tadi, harapan `200`.
4. `PUT /api/tickets/:id` → ubah `statusPembayaran`, harapan `200`.
5. `DELETE /api/tickets/:id` → harapan `200`, lalu GET ulang ID itu → `404`.
