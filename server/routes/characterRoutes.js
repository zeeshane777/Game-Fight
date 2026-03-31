const express = require("express");
const {
  listPublicCharacters,
  listAllCharacters,
  createCharacter,
  updateCharacter,
  toggleCharacter,
  deleteCharacter,
} = require("../controllers/characterController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/public", requireAuth, listPublicCharacters);
router.get("/", requireAuth, requireRole("ADMIN"), listAllCharacters);
router.post("/", requireAuth, requireRole("ADMIN"), createCharacter);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateCharacter);
router.patch("/:id/toggle", requireAuth, requireRole("ADMIN"), toggleCharacter);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteCharacter);

module.exports = router;
