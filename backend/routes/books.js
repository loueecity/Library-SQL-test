const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { title, author, genre, isbn, copies_total } = req.body;
  const copies_available = copies_total;
  const sql = `INSERT INTO books (title, author, genre, isbn, copies_total, copies_available)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [title, author, genre, isbn, copies_total, copies_available], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Book added", bookId: result.insertId });
  });
});

module.exports = router;