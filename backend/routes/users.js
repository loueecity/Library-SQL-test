const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const password_hash = password;
  const sql = `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, password_hash, role], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User registered", userId: result.insertId });
  });
});

module.exports = router;