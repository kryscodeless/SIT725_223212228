const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from ./public
app.use(express.static(path.join(__dirname, "public")));

// Simple endpoint for testing
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// Required: add two numbers via URL query params
// Example: /api/add?a=2&b=3
app.get("/api/add", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({
      error: "Invalid numbers. Use /api/add?a=2&b=3",
    });
  }

  res.json({ a, b, sum: a + b });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});