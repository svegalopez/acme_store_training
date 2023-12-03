const express = require("express");
const router = express.Router();
const { stripe } = require("../clients");
const { sign } = require("jsonwebtoken");

// Product Routes
router.get("/products", async (req, res) => {
  try {
    const { data: stripeProducts } = await stripe.products.list({
      expand: ["data.default_price"],
    });

    // Sign the token
    const token = sign({ foo: "bar" }, process.env.JWT_SECRET, {
      expiresIn: "99 years",
    });

    return res
      .cookie("chatbot_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 3124138248000, // 99 years
      })
      .json(
        stripeProducts.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          imgSrc: product.images[0],
          price: {
            amount: product.default_price.unit_amount / 100,
            priceId: product.default_price.id,
            currency: product.default_price.currency,
          },
          rating: {
            value: product.metadata.rating,
            count: product.metadata.ratingCount,
          },
        }))
      );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
