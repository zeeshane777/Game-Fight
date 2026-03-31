const path = require("path");

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "game-fight-demo-secret",
  dataDir: process.env.VERCEL
    ? path.join("/tmp", "game-fight-data")
    : path.join(__dirname, "data", "storage"),
};
