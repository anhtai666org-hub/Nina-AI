import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Nina AI — にな",
    status: "online",
    version: "0.1.0"
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Nina AI listening on port ${port}`);
});
