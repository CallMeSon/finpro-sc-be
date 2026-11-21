import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import ticketRoutes from "./routes/ticketRoutes.js"

dotenv.config(); //narik var di env

connectDB(); //maggil fungsi koneksi dari mongodb

const app = express(); //insiasi express

app.use(express.json()); //middleware biar bisa baca data json dari req body

app.use("/api/tickets", ticketRoutes); //semua endpoint ticket ada di sini

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Selamat dateng ke sistem pemesanan ticket konser JMK48!",
    status: "server nyala"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] jalan di http://localhost:${PORT}`)
});
