const express = require("express");
const router = express.Router();
const { stripe } = require("../clients");

// Product Routes
router.get("/products", async (req, res) => {
  try {
    const { data: stripeProducts } = await stripe.products.list({
      expand: ["data.default_price"],
    });

    return res.json(
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
