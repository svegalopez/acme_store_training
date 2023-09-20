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
      if (!cart) throw Error("Bad request");

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
          allowed_countries: ["US", "CA"],
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
          tax_rates: ["txr_1NTWfVFx43n0rvYmDHg3gjWR"],
        })),
        mode: "payment",
        success_url: `${APP_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`, // if user is logged in you can redirect to /my-orders/:id, else user will receive an email with order details. access the id of the session using ...?session_id={CHECKOUT_SESSION_ID}
        cancel_url: isOneClick === "true" ? APP_URL : `${APP_URL}/cart`,
        client_reference_id: req.user ? req.user.id : undefined,
        metadata: {
          IS_PROD: process.env.IS_PROD ? "true" : undefined,
        },
      });

      return res.redirect(303, session.url);
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send(
          `Unable to create checkout session at this time. <a href="${APP_URL}" >Go back</a> and try again.`
        );
    }
  }
);

router.get("/order-confirmation", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) throw Error("Bad request");

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
    res.status(400).send(error.message);
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const payload = req.body;
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, WEBHOOK_SECRET);
    } catch (err) {
      console.error(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
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

      // Isolate environments; only fulfill orders that were created in the same environment.
      // This is needed as long as production is configured to use the Stripe test API.
      // Once you switch to the live API, you can remove this check.
      if (session.metadata.IS_PROD === process.env.IS_PROD) {
        fulfillPurchase(session);
      }
    }

    return res.status(200).end();
  }
);

async function fulfillPurchase(session) {
  try {
    // Send confirmation email
    const messageData = {
      from: "Admin <email@sandboxdc00cf352cf44b4ea7c1ebe3330d8423.mailgun.org>",
      to: session.customer_details.email,
      subject: "Order Confirmation",
      html: JSON.stringify(session.line_items),
    };
    await mg.messages
      .create(
        "sandboxdc00cf352cf44b4ea7c1ebe3330d8423.mailgun.org",
        messageData
      )
      .catch((err) => console.log(err));

    // Add Order to database
    await prisma.order.create({
      data: {
        user_id: session.client_reference_id,
        session_id: session.id,
        data: session,
        total: session.amount_total / 100,
      },
    });
    console.log("order written to db");
  } catch (err) {
    console.error(err);
  }
}

module.exports = router;