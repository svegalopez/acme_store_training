const express = require("express");
const router = express.Router();
const { prisma } = require("../clients");
const { authenticate, authorize } = require("../middleware");
const pageSize = 10;

// Order Routes
router.get("/my-orders", authenticate(), async (req, res) => {
  try {
    const query = req.query;

    // Validate query parameters
    if (!query.sortBy || !query.sortOrder || !query.page) {
      throw { status: 400, message: "Invalid query parameters" };
    }

    const count = await prisma.order.count({ where: { user_id: req.user.id } });
    const orders = await prisma.order.findMany({
      skip: (query.page - 1) * pageSize,
      take: pageSize,
      where: { user_id: req.user.id },
      select: {
        id: true,
        created_at: true,
        total: true,
        status: true,
      },
      orderBy: { [query.sortBy]: query.sortOrder },
    });

    return res.json({ orders, totalPages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send(error.message || "Something went wrong. Please try again.");
  }
});

router.get("/my-orders/:id", authenticate(), async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!order) return res.status(404).send("Order not found");

    return res.json(order);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send(error.message || "Something went wrong. Please try again.");
  }
});

// Admin routes
router.get("/orders", authenticate(), authorize("admin"), async (req, res) => {
  try {
    const query = req.query;

    // Validate query parameters
    if (!query.sortBy || !query.sortOrder || !query.page) {
      throw { status: 400, message: "Invalid query parameters" };
    }

    const count = await prisma.order.count();
    const orders = await prisma.order.findMany({
      skip: (query.page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        created_at: true,
        total: true,
        status: true,
      },
      orderBy: { [query.sortBy]: query.sortOrder },
    });

    return res.json({ orders, totalPages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .send(error.message || "Something went wrong. Please try again.");
  }
});

router.get(
  "/orders/:id",
  authenticate(),
  authorize("admin"),
  async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
      });

      if (!order) return res.status(404).send("Order not found");

      return res.json(order);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send(error.message || "Something went wrong. Please try again.");
    }
  }
);

router.patch(
  "/orders/:id",
  authenticate(),
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) throw { status: 400, message: "status is required" };

      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status },
      });

      return res.json(order);
    } catch (error) {
      console.error(error);
      return res
        .status(error.status || 500)
        .send(error.message || "Something went wrong. Please try again.");
    }
  }
);

module.exports = router;
