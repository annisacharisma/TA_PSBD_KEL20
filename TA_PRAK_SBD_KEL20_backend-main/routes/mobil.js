const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Mobil (belum soft-delete)
router.get("/", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM mobil WHERE deleted_at IS NULL";
  db.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error retrieving mobil", error: err.message });
    }
    res.json(results);
  });
});

// Get Mobil yang sudah soft-delete
router.get("/trash", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM mobil WHERE deleted_at IS NOT NULL";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Error retrieving trashed mobil",
        error: err.message,
      });
    }
    res.json(results);
  });
});

// Add Mobil
router.post("/", authenticateToken, (req, res) => {
  const { merk, model, tahun, gambar, harga_sewa_per_hari } = req.body;

  if (!merk || !model || !tahun || !gambar || !harga_sewa_per_hari) {
    return res.status(400).json({
      message:
        "Merk, model, tahun, gambar, dan harga sewa per hari tidak boleh kosong",
    });
  }

  if (
    typeof tahun !== "number" ||
    tahun <= 0 ||
    tahun > new Date().getFullYear()
  ) {
    return res.status(400).json({
      message: `Tahun harus antara 1 dan ${new Date().getFullYear()}`,
    });
  }

  if (typeof harga_sewa_per_hari !== "number" || harga_sewa_per_hari <= 0) {
    return res.status(400).json({
      message: "Harga sewa per hari harus lebih dari 0",
    });
  }

  if (!gambar.startsWith("http")) {
    return res.status(400).json({
      message: "Link gambar harus valid (dimulai dengan http)",
    });
  }

  const sql =
    "INSERT INTO mobil (merk, model, tahun, gambar, harga_sewa_per_hari) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [merk, model, tahun, gambar, harga_sewa_per_hari], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Gagal menambahkan mobil", error: err.message });
    }
    res.status(201).json({ message: "Mobil berhasil ditambahkan" });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { merk, model, tahun, gambar, harga_sewa_per_hari } = req.body;

  const query = `
    UPDATE mobil 
    SET merk = ?, model = ?, tahun = ?, gambar = ?, harga_sewa_per_hari = ? 
    WHERE id_mobil = ?
  `;

  db.query(query, [merk, model, tahun, gambar, harga_sewa_per_hari, id], (err, result) => {
    if (err) {
      console.error("Error updating mobil:", err);
      return res.status(500).json({ message: "Gagal memperbarui mobil" });
    }

    res.status(200).json({ message: "Mobil berhasil diperbarui" });
  });
});

module.exports = router;

