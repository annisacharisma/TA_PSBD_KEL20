const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const {
    nama, ktp, alamat, no_telp,
    id_mobil, tgl_sewa, tgl_kembali,
    tanggal_bayar, total_biaya, metode_bayar
  } = req.body;

  const findCustomer = `SELECT id_cust FROM customer WHERE no_ktp = ? LIMIT 1`;
  db.query(findCustomer, [ktp], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length > 0) {
      insertRental(result[0].id_cust);
    } else {
      const insertCust = `
        INSERT INTO customer (nama_cust, no_ktp, alamat_cust, telp_cust)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertCust, [nama, ktp, alamat, no_telp], (err, custResult) => {
        if (err) return res.status(500).json({ error: err.message });
        insertRental(custResult.insertId);
      });
    }
  });

  function insertRental(id_cust) {
    const status = "Belum Bayar";
    const insertRental = `
      INSERT INTO rental (id_cust, id_mobil, tanggal_sewa, tanggal_kembali, status_transaksi)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertRental, [id_cust, id_mobil, tgl_sewa, tgl_kembali, status], (err, rentalResult) => {
      if (err) return res.status(500).json({ error: err.message });

      const id_rental = rentalResult.insertId;

      const insertPayment = `
        INSERT INTO pembayaran (id_rental, tanggal_bayar, total_biaya, metode_bayar)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertPayment, [id_rental, tanggal_bayar, total_biaya, metode_bayar], (err, paymentResult) => {
        if (err) return res.status(500).json({ error: err.message });

        // ✅ Baru kirim response setelah semua selesai
        return res.status(200).json({ id_rental });
      });
    });
  }
});

module.exports = router;
