const randomBytes = require("crypto").randomBytes;
const scryptSync = require("crypto").scryptSync;

exports.getHash = (password) => {
  const salt = randomBytes(16).toString("hex");
  return `${scryptSync(password, salt, 32).toString("hex")}${salt}`;
};

exports.compareSync = (provided, stored) => {
  const storedSalt = stored.slice(-32);
  const storedHash = stored.slice(0, 64);
  return storedHash === scryptSync(provided, storedSalt, 32).toString("hex");
};
