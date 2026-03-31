const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const { getUsers } = require("../data/store");
const { sanitizeUser } = require("../utils/token");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = getUsers().find((entry) => entry.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }

    req.user = sanitizeUser(user);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide." });
  }
}

module.exports = {
  requireAuth,
};
