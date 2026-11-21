import Ticket from "../models/Ticket.js";

// ambil pesan validasi dari model ("Nama Wajib oey", dst), bukan pesan mongoose mentah
const pesanError = (error) =>
  error.errors ? Object.values(error.errors).map((e) => e.message) : error.message;

const HARGA = { VVIP: 1500000, VIP: 900000, "Orang Biasa": 450000 };

// || 0 biar jumlah kosong tidak jadi NaN, pesan "pilh jumlahnya loh ya" tetap muncul
const hitungTotal = (kategori, jumlah) => (HARGA[kategori] || 0) * (jumlah || 0);

// 1. CREATE - POST /api/tickets
export const createTicket = async (req, res) => {
  try {
    const { namaPemesan, emailPemesan, kategoriTicket, jumlahTicket, lineupGroup } = req.body;

    // harga ditentukan server, client tidak boleh kirim totalHarga sendiri
    const totalHarga = hitungTotal(kategoriTicket, jumlahTicket);

    const newTicket = await Ticket.create({
      namaPemesan,
      emailPemesan,
      kategoriTicket,
      jumlahTicket,
      totalHarga,
      lineupGroup,
    });

    res.status(201).json({
      success: true,
      message: "woke, dana masuk boskyuh",
      data: newTicket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "nipu kah?",
      error: pesanError(error),
    });
  }
};

// 2. READ ALL - GET /api/tickets
export const getAllTickets = async (req, res) => {
  try {
    // sort _id -1 = data terbaru di atas (model belum pakai timestamps)
    const tickets = await Ticket.find().sort({ _id: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "walawe, data gagal diambil",
      error: error.message,
    });
  }
};

// 3. READ ONE - GET /api/tickets/:id
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    // findById tidak error kalau data tidak ada, dia balikin null
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket nya gaada bos, cek lagi ID nya",
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    // id ngawur (misal "123") bikin CastError, jadi masuk sini
    res.status(400).json({
      success: false,
      message: "ID nya ngawur nih, formatnya salah",
      error: error.message,
    });
  }
};

// 4. UPDATE - PUT /api/tickets/:id
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket nya gaada, mau diupdate apanya?",
      });
    }

    // totalHarga selalu dihitung server, kirim dari client diabaikan
    const data = { ...req.body };
    delete data.totalHarga;
    if (data.kategoriTicket !== undefined || data.jumlahTicket !== undefined) {
      data.totalHarga = hitungTotal(
        data.kategoriTicket ?? ticket.kategoriTicket,
        data.jumlahTicket ?? ticket.jumlahTicket
      );
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, data, {
      new: true, // balikin data SETELAH diupdate
      runValidators: true, // enum/min/max tetap dicek saat update
    });

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket nya gaada, mau diupdate apanya?",
      });
    }

    res.status(200).json({
      success: true,
      message: "Oke, data ticket udah diupdate",
      data: updatedTicket,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Yah, gagal update ticket",
      error: pesanError(error),
    });
  }
};

// 5. DELETE - DELETE /api/tickets/:id
export const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

    if (!deletedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket nya gaada, mau dihapus apanya?",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket udah dihapus, bye bye",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Yah, gagal hapus ticket",
      error: error.message,
    });
  }
};
