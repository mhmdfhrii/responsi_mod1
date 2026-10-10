import express from "express";
import dotenv from "dotenv";
import loanRoutes from "./routes/loanRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Library Loan API",
    status: "ok",
    endpoints: ["/loans", "/books", "/members"],
  });
});

app.use("/loans", loanRoutes);
app.use("/books", bookRoutes);
app.use("/members", memberRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
