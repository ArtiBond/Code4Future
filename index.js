const express = require("express");
const path = require("path");
const usersDB = require("./users_bd.json");
const fs = require('fs');

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
  const { email, password } = req.body;
  let existAc = false;

  for (let user of usersDB) {
    if (user.email == email) {
      if (user.password == password) {
        console.log("LOGIN OK!");
      } else {
        console.log("PASSWORD IS WRONG!");
      }
      existAc = true;
    }
  }

  if (!existAc) {
    console.log("ACCOUNT ISN'T EXIST!");
  }
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "register.html"));
});

app.post("/register", (req, res) => {
  const { nickname, email, country, role, password, confirm } = req.body;

    const newUser = {
        nickname : nickname,
        email : email,
        country : country,
        role : role,
        password : password
    }

    usersDB.push(newUser);

    fs.writeFile(path.join(__dirname, "users_bd.json"), JSON.stringify(usersDB, null, 2), (err) => {
      if (err) {
        console.error("Error writing to users database:", err);
        res.status(500).send("Error saving user data");
      } else {
        console.log("New user added:", newUser);
        res.redirect("/login");
      }
    });
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING http://localhost:" + PORT);
});
