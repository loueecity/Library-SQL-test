const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password1",
  database: "smart_library"
});
db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});
module.exports = db;