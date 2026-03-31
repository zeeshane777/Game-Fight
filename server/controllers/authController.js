const bcrypt = require("bcryptjs");
const { getUsers, saveUsers, nextId } = require("../data/store");
const { createToken, sanitizeUser } = require("../utils/token");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nom, email et mot de passe sont requis." });
  }

  const users = getUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.status(409).json({ message: "Cet email existe deja." });
  }

  const user = {
    id: nextId(users),
    name,
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 10),
    role: "JOUEUR",
  };

  users.push(user);
  saveUsers(users);

  return res.status(201).json({
    token: createToken(user),
    user: sanitizeUser(user),
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe sont requis." });
  }

  const user = getUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  return res.json({
    token: createToken(user),
    user: sanitizeUser(user),
  });
}

function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  me,
};
