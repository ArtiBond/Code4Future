const express = require("express");
const path = require("path");

const app = express();
const PORT = 1488;

app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "tours.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "login.html"));
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.send("LOGIN OK");
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING http://localhost:" + PORT);
});
