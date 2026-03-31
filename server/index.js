const app = require("./app");
const { port } = require("./config");
const { ensureStore } = require("./data/store");

ensureStore();

app.listen(port, () => {
  console.log(`GAME FIGHT server listening on http://localhost:${port}`);
});
