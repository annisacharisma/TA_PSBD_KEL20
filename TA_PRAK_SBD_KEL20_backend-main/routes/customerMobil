const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ GET semua mobil
router.get("/", (req, res) => {
  const query = `SELECT * FROM mobil WHERE deleted_at IS NULL`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ GET mobil by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM mobil WHERE id_mobil = ?`;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Mobil not found" });
    res.json(result[0]);
  });
});

module.exports = router;
