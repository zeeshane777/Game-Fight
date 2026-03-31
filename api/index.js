const app = require("../server/app");
const { ensureStore } = require("../server/data/store");

ensureStore();

module.exports = app;
