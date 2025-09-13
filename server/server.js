const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");
const SECRET_KEY = "YOUR_SECRET_KEY";

// DB helper
const readDB = () => {
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], files: [] }));
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
};
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// JWT auth
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Access denied" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Users
app.post("/api/users", async (req, res) => {
  const { username, password, email } = req.body;
  const db = readDB();
  const lowerEmail = email.toLowerCase();
  if (db.users.find(u => u.email === lowerEmail || u.username === username)) return res.status(400).json({ error: "کاربر قبلاً ثبت‌نام کرده است" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), username, email: lowerEmail, password: hashedPassword };
  db.users.push(newUser);
  writeDB(db);
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: "7d" });
  res.json({ user: { id: newUser.id, username, email: lowerEmail }, token });
});

app.post("/api/users/login", async (req, res) => {
  const { password, email } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(400).json({ error: "ایمیل یا رمز عبور اشتباه است" });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "ایمیل یا رمز عبور اشتباه است" });
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });
  res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
});

app.get("/api/users", (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// Files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(__dirname, "uploads", req.user.email);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Serve files securely
app.use('/uploads', authenticate, express.static(path.join(__dirname, "uploads")));

app.post("/upload", authenticate, upload.single("file"), (req, res) => {
  res.json({ success: true, filename: req.file.filename });
});

app.get("/files/:email", authenticate, (req, res) => {
  if (req.user.email !== req.params.email.toLowerCase()) return res.status(403).json({ error: "Forbidden" });
  const userDir = path.join(__dirname, "uploads", req.params.email.toLowerCase());
  if (!fs.existsSync(userDir)) return res.json([]);
  const files = fs.readdirSync(userDir).map(f => ({
    filename: f,
    viewUrl: `http://localhost:9000/uploads/${req.params.email.toLowerCase()}/${f}`,
  }));
  res.json(files);
});

app.get("/download/:email/:filename", authenticate, (req, res) => {
  if (req.user.email !== req.params.email.toLowerCase()) return res.status(403).json({ error: "Forbidden" });
  const filePath = path.join(__dirname, "uploads", req.params.email.toLowerCase(), req.params.filename);
  res.download(filePath);
});

app.delete("/delete/:email/:filename", authenticate, (req, res) => {
  if (req.user.email !== req.params.email.toLowerCase()) return res.status(403).json({ error: "Forbidden" });
  const filePath = path.join(__dirname, "uploads", req.params.email.toLowerCase(), req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "File not found" });
});

app.listen(9000, () => console.log("🚀 Server running on http://localhost:9000"));
