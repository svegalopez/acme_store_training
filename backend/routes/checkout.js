const express = require("express");
const router = express.Router();

// Checkout Routes

// Implement an endpoint at the "/create-checkout-session" path that creates a
// new checkout session.

router.get("/order-confirmation", async (req, res) => {
  // Implement this endpoint that returns the data for the order confirmation page
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    // Implement this endpoint that handles the Stripe webhook for the "checkout.session.completed" event
  }
);

async function fulfillPurchase(session) {
  try {
    // Implement this function that sends a confirmation email
    // to the customer and adds the order to the database
  } catch (error) {
    console.error(`Error fulfilling order for session ${session.id}`);
    console.error(error);
  }
}

module.exports = router;
