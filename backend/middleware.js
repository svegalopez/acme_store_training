const { verify } = require("jsonwebtoken");
const { prisma } = require("./clients");
const secret = process.env.JWT_SECRET;

exports.authenticate = (optional) => async (req, res, next) => {
  // Implement this middleware...
};

exports.authorize = (role) => async (req, res, next) => {
  // Implement this middleware...
};
