const { verify } = require("jsonwebtoken");
const { prisma } = require("./clients");
const secret = process.env.JWT_SECRET;

exports.authenticate = (optional) => async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token && optional) {
    return next();
  } else if (!token) {
    return res.status(401).send("Please provide your credentials");
  }

  verify(token, secret, async (err, decoded) => {
    if (err) return res.status(401).send("Unable to verify credentials");

    const user = await prisma.user
      .findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true },
      })
      .catch((err) => console.log(err));
    if (!user) return res.status(404).send("User not found");

    req.user = user;
    next();
  });
};

exports.authorize = (role) => async (req, res, next) => {
  if (!req.user)
    return res
      .status(500)
      .send("Internal misconfiguration: wrong use of middleware");
  if (req.user.role !== role) return res.status(403).send("Unauthorized");
  next();
};
