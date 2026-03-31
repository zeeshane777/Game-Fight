const bcrypt = require("bcryptjs");

const DEFAULT_USERS = [
  {
    id: 1,
    name: "Admin Demo",
    email: "admin@gamefight.dev",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "ADMIN",
  },
  {
    id: 2,
    name: "Player Demo",
    email: "joueur@gamefight.dev",
    passwordHash: bcrypt.hashSync("player123", 10),
    role: "JOUEUR",
  },
];

const DEFAULT_CHARACTERS = [
  {
    id: 1,
    nom: "Ryu",
    image: "https://street-crescer.surge.sh/images/characters/ryu.png",
    actif: true,
    stats: { vie: 120, attaque: 20, defense: 12, vitesse: 18, manaMax: 90 },
    competences: [
      { nom: "Poing rapide", type: "physique", puissance: 10, coutMana: 0, description: "Une frappe rapide pour mettre la pression.", animation: "melee" },
      { nom: "Hadoken", type: "energie", puissance: 18, coutMana: 18, description: "Une boule d'energie frontale.", animation: "projectile" },
      { nom: "Shoryuken", type: "uppercut", puissance: 24, coutMana: 26, description: "Un uppercut explosif qui punit l'adversaire.", animation: "uppercut" },
      { nom: "Denjin Burst", type: "ultime", puissance: 34, coutMana: 35, description: "Un impact charge tres puissant.", animation: "ultimate" }
    ],
  },
  {
    id: 2,
    nom: "Ken",
    image: "https://street-crescer.surge.sh/images/characters/ken.png",
    actif: true,
    stats: { vie: 112, attaque: 22, defense: 10, vitesse: 20, manaMax: 88 },
    competences: [
      { nom: "Combo furious", type: "physique", puissance: 11, coutMana: 0, description: "Une chaine de coups agressive.", animation: "melee" },
      { nom: "Flamme rouge", type: "feu", puissance: 19, coutMana: 17, description: "Une projection de feu courte portee.", animation: "projectile" },
      { nom: "Dragon kick", type: "kick", puissance: 25, coutMana: 24, description: "Un coup montant qui ouvre la garde.", animation: "uppercut" },
      { nom: "Inferno rush", type: "ultime", puissance: 32, coutMana: 34, description: "Une salve embrasee tres agressive.", animation: "ultimate" }
    ],
  },
  {
    id: 3,
    nom: "Chun-Li",
    image: "https://street-crescer.surge.sh/images/characters/chun_li.png",
    actif: true,
    stats: { vie: 108, attaque: 18, defense: 11, vitesse: 26, manaMax: 96 },
    competences: [
      { nom: "Eclair jambe", type: "kick", puissance: 9, coutMana: 0, description: "Un enchainement ultra rapide.", animation: "melee" },
      { nom: "Kikoken", type: "energie", puissance: 17, coutMana: 16, description: "Une onde d'energie precise.", animation: "projectile" },
      { nom: "Cyclone kick", type: "aerien", puissance: 23, coutMana: 23, description: "Une rotation offensive destabilise l'ennemi.", animation: "uppercut" },
      { nom: "Senretsu storm", type: "ultime", puissance: 31, coutMana: 32, description: "Une rafale de coups legers mais devastateurs.", animation: "ultimate" }
    ],
  },
  {
    id: 4,
    nom: "Cammy",
    image: "https://street-crescer.surge.sh/images/characters/cammy.png",
    actif: true,
    stats: { vie: 126, attaque: 17, defense: 15, vitesse: 16, manaMax: 92 },
    competences: [
      { nom: "Straight hit", type: "physique", puissance: 8, coutMana: 0, description: "Un coup direct pour casser le rythme.", animation: "melee" },
      { nom: "Sonic boom", type: "energie", puissance: 18, coutMana: 16, description: "Un projectile tranche l'air.", animation: "projectile" },
      { nom: "Flash kick", type: "counter", puissance: 24, coutMana: 22, description: "Une riposte explosive en arc.", animation: "uppercut" },
      { nom: "Air barrage", type: "ultime", puissance: 30, coutMana: 31, description: "Une pression continue qui use l'adversaire.", animation: "ultimate" }
    ],
  },
];

module.exports = {
  DEFAULT_USERS,
  DEFAULT_CHARACTERS,
};
