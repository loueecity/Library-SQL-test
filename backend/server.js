const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/books", require("./routes/books"));
app.use("/users", require("./routes/users"));
app.use("/borrowings", require("./routes/borrowings"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));