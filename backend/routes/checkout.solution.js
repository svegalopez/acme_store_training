const express = require("express");
const router = express.Router();
const { prisma, mg, stripe } = require("../clients");
const { authenticate } = require("../middleware");
const APP_URL = process.env.APP_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Checkout Routes

router.post(
  "/create-checkout-session",
  authenticate(true),
  async (req, res) => {
    try {
      const { cart, isOneClick } = req.body;
      if (!cart) return res.status(400).send("Bad request, cart is required");

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
          allowed_countries: ["US", "CA"], // This is up to you.
        },
        billing_address_collection: "required",
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 0,
                currency: "usd",
              },
              display_name: "Free shipping",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 5,
                },
                maximum: {
                  unit: "business_day",
                  value: 7,
                },
              },
            },
          },
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 1500,
                currency: "usd",
              },
              display_name: "Expedited shipping",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 1,
                },
                maximum: {
                  unit: "business_day",
                  value: 3,
                },
              },
            },
          },
        ],
        line_items: JSON.parse(cart).map((item) => ({
          price: item.priceId,
          quantity: item.qty,
          tax_rates: ["txr_xxxxxxxxxxxxxxxxxxxxxxxx"], // You must create this tax rate in your Stripe dashboard
        })),
        mode: "payment",
        success_url: `${APP_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: isOneClick === "true" ? APP_URL : `${APP_URL}/cart`,
        client_reference_id: req.user ? req.user.id : undefined,
        metadata: {
          IS_PROD: process.env.IS_PROD ? "true" : undefined, // Used until you switch to live mode
        },
      });

      return res.redirect(303, session.url);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send(
          `Unable to create checkout session at this time. Go back and try again.`
        );
    }
  }
);

router.get("/order-confirmation", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id)
      return res.status(400).send("Bad request, session_id is required");

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: [
        "line_items",
        "shipping_cost.shipping_rate",
        "line_items.data.price.product",
      ],
    });

    return res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const payload = req.body;
      const sig = req.headers["stripe-signature"];
      let event = stripe.webhooks.constructEvent(payload, sig, WEBHOOK_SECRET);

      if (event.type !== "checkout.session.completed")
        return res.status(200).end();

      // Handle the checkout.session.completed event
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: [
            "line_items",
            "shipping_cost.shipping_rate",
            "line_items.data.price.product",
          ],
        }
      );
      res.status(200).end();

      // Fulfill the purchase
      fulfillPurchase(session);
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  }
);

async function fulfillPurchase(session) {
  try {
    if (session.metadata.IS_PROD !== process.env.IS_PROD) return;

    // Send confirmation email
    const messageData = {
      from: "Admin <email@sandboxdcxxx.mailgun.org>", // Make sure this matches your Mailgun domain
      to: session.customer_details.email,
      subject: "Order Confirmation",
      html: JSON.stringify(session.line_items),
    };
    await mg.messages.create("sandboxdcxxx.mailgun.org", messageData); // Make sure this matches your Mailgun domain

    // Add Order to database
    await prisma.order.create({
      data: {
        user_id: session.client_reference_id,
        session_id: session.id,
        data: session,
        total: session.amount_total / 100,
      },
    });
  } catch (error) {
    console.error(`Error fulfilling order for session ${session.id}:`);
    console.error(error);
  }
}

module.exports = router;
