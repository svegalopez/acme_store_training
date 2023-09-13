const express = require("express");
const router = express.Router();

// Order Routes
// Implement the GET "/my-orders" endpoint that returns a list of orders for the authenticated user

// Implement the GET "/my-orders/:id" endpoint that returns a single order for the authenticated user

// Admin routes
const pageSize = 10;
// Implement the GET "/orders" endpoint that returns a list of orders for the admin user using pagination

// Implement the GET "/orders/:id" endpoint that returns a single order for the admin user

// Implement the PATCH "/orders/:id" endpoint that updates an order's status

module.exports = router;
