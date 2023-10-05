const express = require("express");
const router = express.Router();
const { prisma } = require("../clients");
const crypto = require("crypto");
const { authenticate } = require("../middleware");
const { compareSync, getHash } = require("../utils/passwordHash");
const { sign } = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const { OAuth2Client } = require("google-auth-library");

// Auth Routes
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    if (typeof password !== "string") {
      return res.status(400).send("Invalid password");
    }

    if (password.length < 8) {
      return res.status(400).send("Password must have at least 8 characters");
    }

    if (!password.match(/[a-z]/g)) {
      return res.status(400).send("Password must have one lowercase letter");
    }

    if (!password.match(/[A-Z]/g)) {
      return res.status(400).send("Password must have one uppercase letter");
    }

    if (!password.match(/[0-9]/g)) {
      return res.status(400).send("Password must have one number");
    }

    if (typeof email !== "string") {
      return res.status(400).send("Invalid email");
    }

    // Use a regex to validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email");
    }

    let msg;
    const user = await prisma.user
      .create({
        data: {
          email: email.toLocaleLowerCase(),
          password: getHash(password),
        },
      })
      .catch((err) => {
        if (err.code && err.code === "P2002") {
          msg = "User with that email already exists";
        } else {
          throw err;
        }
      });

    if (!user) return res.status(400).send(msg);

    // Sign token and return to user, user will be logged in
    const token = sign({ id: user.id, email: user.email }, secret);

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 week
      })
      .json({
        user,
        token,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong. Please try again later.");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    if (typeof password !== "string") {
      return res.status(400).send("Invalid password");
    }

    if (typeof email !== "string") {
      return res.status(400).send("Invalid email");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLocaleLowerCase() },
    });
    if (!user) return res.status(404).send("User not found");

    if (compareSync(password, user.password)) {
      const token = sign({ id: user.id, email: user.email }, secret);
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 14, // 2 week
        })
        .json({ token, user });
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Something went wrong. Please try again later.");
  }
});

router.post("/logout", (req, res) => {
  return res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    })
    .end();
});

router.get("/current-user", authenticate(), async (req, res) => {
  return res.json(req.user);
});

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.get("/google-callback", async (req, res) => {
  let code = req.query.code;
  const { tokens } = await client.getToken(code);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  const email = payload.email;

  // Create user if not exist
  let existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        email,
        password: crypto.randomUUID(),
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  // Create token
  const token = sign(
    { id: existingUser.id, email: existingUser.email },
    secret,
    { expiresIn: "30d" }
  );

  // Extract the "cartkey" and "redirect" query params from state
  const state = req.query.state?.split("&");
  const cartKey = state?.find((s) => s.includes("cartkey"))?.split("=")[1];
  const redirect = state?.find((s) => s.includes("redirect"))?.split("=")[1];

  // Redirect to frontend
  const redirectUrl = new URL(process.env.APP_URL);
  if (redirect === "checkout") {
    // Immediately redirect to checkout
    redirectUrl.pathname = "/cart";
    redirectUrl.searchParams.append("submit", "1");
  }
  if (cartKey) {
    // Recover the guest cart items after login
    redirectUrl.searchParams.append("cartkey", cartKey);
  }

  return res
    .cookie("access_token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 2 week
    })
    .redirect(redirectUrl); // redirect to cart with submit flag if there is state /cart?submit=1
});

module.exports = router;
