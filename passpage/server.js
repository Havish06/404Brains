const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "supersecretkey", // change for production, keep secret
  resave: false,
  saveUninitialized: false
}));

// === DIRECT (plain) 3-digit password ===
const PASSWORD = "123"; // <-- put your 3-digit code here

function requireAuth(req, res, next) {
  if (req.session.loggedIn) return next();
  res.redirect("/login");
}

// serve static public files
app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/login", (req, res) => {
  const password = (req.body.password || "").trim();
  console.log("Login attempt with:", JSON.stringify(password));

  if (password === PASSWORD) {
    req.session.loggedIn = true;
    return res.redirect("/secret");
  } else {
    // stay on login, show inline error via ?error=1
    return res.redirect("/login?error=1");
  }
});

app.get("/secret", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "secret.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
