const usersDB = require("./users_bd.json")

console.log(usersDB.length)


// ---------- helpers ----------
const USERS_FILE = path.join(__dirname, "users_bd.json");

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const raw = fs.readFileSync(USERS_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("users_bd.json is not valid JSON");
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ---------- pages ----------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/tornaments", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "tournaments.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "login.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "admin.html"));
});

app.get("/announcements", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "announcements.html"));
});

app.get("/juryProfile", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "juryProfile.html"));
});

app.get("/juryRated", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "juryRated.html"));
});

app.get("/leaderboard", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "leaderboard.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "profile.html"));
});

app.get("/submission", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "submission.html"));
});

app.get("/team-register", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "team-register.html"));
});

app.get("/tournament", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "tournament.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "register.html"));
});

// ---------- AUTH ----------
app.post("/login", (req, res) => {
  console.log("POST /login start");
  console.log("body:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("missing fields");
      return res.status(400).send("Missing email or password");
    }

    const filePath = path.join(__dirname, "users_bd.json");
    console.log("reading:", filePath);

    const raw = fs.readFileSync(filePath, "utf-8");
    console.log("raw length:", raw.length);

    const users = JSON.parse(raw);
    console.log("users count:", users.length);

    const user = users.find(u => u.email === email);
    console.log("user found:", !!user);

    if (!user) {
      return res.status(401).send("ACCOUNT DOESN'T EXIST");
    }

    if (user.password !== password) {
      return res.status(401).send("WRONG PASSWORD");
    }

    console.log("LOGIN OK -> redirect /profile");
    return res.redirect("/profile");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).send("SERVER ERROR");
  }
});
app.post("/register", (req, res) => {
  const { nickname, email, country, role, password, confirm } = req.body;

  if (!nickname || !email || !country || !role || !password || !confirm) {
    return res.status(400).send("All fields are required");
  }

  if (password !== confirm) {
    return res.status(400).send("Passwords do not match");
  }

  const users = readUsers();

  const exists = users.some((u) => u.email === email);
  if (exists) {
    return res.status(409).send("Email already registered");
  }

  users.push({ nickname, email, country, role, password });

  try {
    writeUsers(users);
  } catch (err) {
    console.error("Write error:", err);
    return res.status(500).send("Error saving user data");
  }

  console.log("REGISTER OK:", email);
  return res.redirect("/login");
});

// ---------- start ----------