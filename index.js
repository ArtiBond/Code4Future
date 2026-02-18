const express = require("express");
const path = require("path");
const usersDB = require("./users_bd.json")

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
    let existAc = false

    for(let user of usersDB) {
        if(user.email == email) {
            if(user.password == password) {
                console.log("LOGIN OK!");
            }
            else {
                console.log("PASSWORD IS WRONG!");
            };
            existAc = true;
        };

    };

    if(existAc == false) {
        console.log("ACCOUNT ISN`T EXIST!");
    };

});

app.listen(PORT, () => {
  console.log("SERVER RUNNING http://localhost:" + PORT);
});

