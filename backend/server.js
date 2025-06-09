import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
const adapter = new JSONFile("db.json");
const db = new Low(adapter, { reviews: [], users: [] });

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/reviews", async (req, res) => {
    await db.read();
    res.json(db.data.reviews);
});

app.post("/reviews", async (req, res) => {
const { roomNumber, email, body } = req.body;
const newReview = {
    id: nanoid(),
    roomNumber,
    email,
    body,
};
await db.read();
db.data.reviews.push(newReview);
await db.write();
res.json({ message: "Review added. ", review: newReview });
});

app.put("/reviews/:id", async (req, res) => {
    const { id } = req.params;
    const { roomNumber, email, body } = req.body;

    await db.read();
    const index = db.data.reviews.findIndex((r) => r.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Review not found." });
    }

    db.data.reviews[index] = {
        ...db.data.reviews[index],
        roomNumber,
        email,
        body,
    };

    await db.write();
    res.json({ message: "Review updated.", review: db.data.reviews[index] });
});

app.delete("/reviews/:id", async (req, res) => {
    const { id } = req.params;

    await db.read();
    const index = db.data.reviews.findIndex((r) => r.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Review not found." });
    }

    db.data.reviews.splice(index, 1);
    await db.write();

    res.json({ message: "Review deleted!" });
});

app.post("/signup", async (req, res) => {
  await db.read();
  db.data.users ||= []; // jeśli nie ma tablicy users, to ją twórz

  const { username, password } = req.body;

  const exists = db.data.users.find(u => u.username === username);
  if (exists) return res.status(400).json({ error: "Username already taken" });

  const hashed = bcrypt.hashSync(password, 10);
  db.data.users.push({ username, password: hashed });

  await db.write();

  res.json({ username });
});

app.post("/login", async (req, res) => {
  await db.read();
  db.data.users ||= [];

  const { username, password } = req.body;

  const user = db.data.users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  res.json({ username });
});
