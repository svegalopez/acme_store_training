require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3088;
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) =>
  req.path === "/api/webhook" ? next() : express.json()(req, res, next)
);

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// Warmup request
app.get("/_ah/warmup", (req, res) => {
  res.send("OK");
});

// Endpoints
app.use(
  "/api",
  require("./routes/products"),
  require("./routes/orders"),
  require("./routes/checkout"),
  require("./routes/auth")
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
