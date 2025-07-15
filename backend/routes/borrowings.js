const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/borrow", (req, res) => {
  const { user_id, book_id } = req.body;
  const issue_date = new Date();
  const due_date = new Date();
  due_date.setDate(issue_date.getDate() + 14);

  db.query("SELECT copies_available FROM books WHERE id = ?", [book_id], (err, result) => {
    if (err || result.length === 0) return res.status(400).send("Book not found");
    if (result[0].copies_available <= 0) return res.status(400).send("No copies available");

    db.beginTransaction(err => {
      if (err) return res.status(500).send(err);

      db.query("UPDATE books SET copies_available = copies_available - 1 WHERE id = ?", [book_id]);
      db.query(
        "INSERT INTO borrowings (user_id, book_id, issue_date, due_date) VALUES (?, ?, ?, ?)",
        [user_id, book_id, issue_date, due_date],
        (err, result) => {
          if (err) return db.rollback(() => res.status(500).send(err));
          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).send(err));
            res.json({ message: "Book borrowed" });
          });
        }
      );
    });
  });
});

router.post("/return", (req, res) => {
  const { borrowing_id } = req.body;
  const today = new Date();

  db.query("SELECT book_id, due_date FROM borrowings WHERE id = ?", [borrowing_id], (err, result) => {
    if (err || result.length === 0) return res.status(400).send("Invalid borrowing ID");
    const { book_id, due_date } = result[0];
    const fine = Math.max(0, Math.ceil((today - new Date(due_date)) / (1000 * 60 * 60 * 24)) * 0.5);

    db.beginTransaction(err => {
      if (err) return res.status(500).send(err);

      db.query("UPDATE borrowings SET return_date = ?, fine = ? WHERE id = ?", [today, fine, borrowing_id]);
      db.query("UPDATE books SET copies_available = copies_available + 1 WHERE id = ?", [book_id]);

      db.commit(err => {
        if (err) return db.rollback(() => res.status(500).send(err));
        res.json({ message: "Book returned", fine });
      });
    });
  });
});

module.exports = router;