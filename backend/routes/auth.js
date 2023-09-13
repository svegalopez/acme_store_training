const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

// Auth Routes
router.post("/register", async (req, res) => {
  // Implement this endpoint that creates a new user
});

router.post("/login", async (req, res) => {
  // Implement this endpoint that logs in a user
});

router.post("/logout", (req, res) => {
  // Implement this endpoint that logs out a user
});

// Implement an endpoint that returns the currently logged in user at the path "/current-user"

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.get("/google-callback", async (req, res) => {
  // Implement this endpoint that handles the Google OAuth2 callback
});

module.exports = router;
