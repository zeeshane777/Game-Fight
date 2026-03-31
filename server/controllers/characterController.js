const { getCharacters, saveCharacters, nextId } = require("../data/store");

function isValidCharacterPayload(payload) {
  if (!payload.nom || !payload.image || typeof payload.actif !== "boolean") {
    return false;
  }

  if (!payload.stats) {
    return false;
  }

  const statKeys = ["vie", "attaque", "defense", "vitesse", "manaMax"];
  const hasValidStats = statKeys.every(
    (key) => typeof payload.stats[key] === "number" && payload.stats[key] >= 0
  );

  const hasFourSkills =
    Array.isArray(payload.competences) &&
    payload.competences.length === 4 &&
    payload.competences.every(
      (skill) =>
        skill &&
        skill.nom &&
        skill.type &&
        typeof skill.puissance === "number" &&
        typeof skill.coutMana === "number" &&
        skill.description
    );

  return hasValidStats && hasFourSkills;
}

function listPublicCharacters(req, res) {
  return res.json(getCharacters().filter((character) => character.actif));
}

function listAllCharacters(req, res) {
  return res.json(getCharacters());
}

function createCharacter(req, res) {
  if (!isValidCharacterPayload(req.body)) {
    return res.status(400).json({
      message: "Payload invalide. Un personnage doit avoir les stats requises et 4 competences.",
    });
  }

  const characters = getCharacters();
  const character = { ...req.body, id: nextId(characters) };
  characters.push(character);
  saveCharacters(characters);
  return res.status(201).json(character);
}

function updateCharacter(req, res) {
  const characterId = Number(req.params.id);

  if (!isValidCharacterPayload(req.body)) {
    return res.status(400).json({
      message: "Payload invalide. Un personnage doit avoir les stats requises et 4 competences.",
    });
  }

  const characters = getCharacters();
  const index = characters.findIndex((character) => character.id === characterId);

  if (index === -1) {
    return res.status(404).json({ message: "Personnage introuvable." });
  }

  characters[index] = { ...req.body, id: characterId };
  saveCharacters(characters);
  return res.json(characters[index]);
}

function toggleCharacter(req, res) {
  const characterId = Number(req.params.id);
  const characters = getCharacters();
  const index = characters.findIndex((character) => character.id === characterId);

  if (index === -1) {
    return res.status(404).json({ message: "Personnage introuvable." });
  }

  characters[index] = { ...characters[index], actif: !characters[index].actif };
  saveCharacters(characters);
  return res.json(characters[index]);
}

function deleteCharacter(req, res) {
  const characterId = Number(req.params.id);
  const characters = getCharacters();
  const index = characters.findIndex((character) => character.id === characterId);

  if (index === -1) {
    return res.status(404).json({ message: "Personnage introuvable." });
  }

  const [removed] = characters.splice(index, 1);
  saveCharacters(characters);
  return res.json(removed);
}

module.exports = {
  listPublicCharacters,
  listAllCharacters,
  createCharacter,
  updateCharacter,
  toggleCharacter,
  deleteCharacter,
};
