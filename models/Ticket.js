import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  namaPemesan: {
    type: String,
    required: [true, "Nama Wajib oey"],
    trim: true,
  },
  emailPemesan: {
    type: String,
    required: [true, "Isi email nya wok"],
    trim: true,
  },
  kategoriTicket: {
    type: String,
    required: [true, "Pilih cuy"],
    enum: ["VVIP", "VIP", "Orang Biasa"], // pilihan wajib di kategori
  },
  jumlahTicket: {
    type: Number,
    required: [true, "pilh jumlahnya loh ya"],
    min: [1, "satu minimal"],
    max: [5, "maksimal 5 cik, kamu reseller yah?"],
  },
  totalHarga: {
    type: Number,
    required: [true]
  },
  statusPembayaran: {
    type: String,
    enum: ["bayar dulu mpruy", "dana masuk boskyuh", "cancelled"],
    default: "bayar dulu mpruy",
  },
  lineupGroup: {
    type: String,
    required: [true, "monggo di pilih mas"],
    enum: [
      "Lineup Ngawi (Lil nus nus, Mas Amba, Rusdi)",
      "Lineup Oslo (Fuad, Rehan, Mr Ironi)",
    ]
  },
});

export default mongoose.model("Ticket", ticketSchema);
