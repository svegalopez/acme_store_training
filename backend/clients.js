const { PrismaClient } = require("./prisma/client");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

exports.prisma = new PrismaClient();

exports.mg = new Mailgun(formData).client({
  username: "api",
  key: process.env.MAILGUN_KEY || "",
});

exports.stripe = require("stripe")(process.env.STRIPE_KEY);
