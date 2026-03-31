const fs = require("fs");
const path = require("path");
const { dataDir } = require("../config");
const { DEFAULT_USERS, DEFAULT_CHARACTERS } = require("./defaults");

const usersFile = path.join(dataDir, "users.json");
const charactersFile = path.join(dataDir, "characters.json");

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify(DEFAULT_USERS, null, 2));
  }

  if (!fs.existsSync(charactersFile)) {
    fs.writeFileSync(charactersFile, JSON.stringify(DEFAULT_CHARACTERS, null, 2));
  }
}

function readJson(filePath) {
  ensureStore();
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, value) {
  ensureStore();
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function getUsers() {
  return readJson(usersFile);
}

function saveUsers(users) {
  writeJson(usersFile, users);
}

function getCharacters() {
  const characters = readJson(charactersFile);
  let changed = false;
  const inferAnimation = (skill) => {
    if (skill.animation) {
      return skill.animation;
    }

    if (skill.type === "energie" || skill.type === "feu") {
      return "projectile";
    }

    if (skill.type === "uppercut" || skill.type === "aerien" || skill.type === "counter") {
      return "uppercut";
    }

    if (skill.type === "ultime") {
      return "ultimate";
    }

    return "melee";
  };

  const normalized = characters.map((character) => {
    let nextCharacter = character;

    if (
      character.nom === "Guile" ||
      (character.image &&
        (character.image.includes("charlie.png") ||
          character.image.includes("guile.png")))
    ) {
      changed = true;
      nextCharacter = {
        ...character,
        nom: "Cammy",
        image: "https://street-crescer.surge.sh/images/characters/cammy.png",
      };
    }

    return {
      ...nextCharacter,
      competences: nextCharacter.competences.map((skill) => {
        const animation = inferAnimation(skill);
        if (skill.animation !== animation) {
          changed = true;
          return {
            ...skill,
            animation,
          };
        }

        return skill;
      }),
    };
  });

  if (changed) {
    saveCharacters(normalized);
  }

  return normalized;
}

function saveCharacters(characters) {
  writeJson(charactersFile, characters);
}

module.exports = {
  ensureStore,
  nextId,
  getUsers,
  saveUsers,
  getCharacters,
  saveCharacters,
};
