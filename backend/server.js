require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3088;
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Implement this middleware that makes sure the "/webhook" endpoint is not parsed as JSON
});

app.use(
  cors({
    // Fill this out...
  })
);

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// Warmup request
// Implement this endpoint that returns "OK" for the App Engine warmup request

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
