function cloneCharacter(character) {
  return {
    ...character,
    currentHp: character.stats.vie,
    currentMana: character.stats.manaMax,
  };
}

export function createBattleState(playerTemplate, enemyTemplate) {
  const player = cloneCharacter(playerTemplate);
  const enemy = cloneCharacter(enemyTemplate);
  const starts = player.stats.vitesse >= enemy.stats.vitesse ? "player" : "enemy";

  return {
    turn: 1,
    currentTurn: starts,
    player,
    enemy,
    log: [
      `Le combat commence. ${
        starts === "player" ? player.nom : enemy.nom
      } prend l'initiative grace a sa vitesse.`,
    ],
    winner: null,
  };
}

function buildFallbackSkill() {
  return {
    nom: "Attaque simple",
    type: "base",
    puissance: 8,
    coutMana: 0,
    description: "Une attaque gratuite de secours.",
  };
}

function computeDamage(attacker, defender, skill, critical) {
  const raw = attacker.stats.attaque + skill.puissance - Math.floor(defender.stats.defense * 0.6);
  const baseDamage = Math.max(6, raw);
  return critical ? baseDamage * 2 : baseDamage;
}

function describeAction(turn, actor, skill, damage, critical, usedFallback) {
  if (usedFallback) {
    return `Tour ${turn} : ${actor.nom} n'a pas assez de mana, il utilise ${skill.nom} et inflige ${damage} degats.`;
  }

  if (critical) {
    return `Tour ${turn} : ${actor.nom} utilise ${skill.nom}, coup critique, ${damage} degats.`;
  }

  return `Tour ${turn} : ${actor.nom} utilise ${skill.nom} et inflige ${damage} degats.`;
}

function resolveSkill(character, skillIndex) {
  const selectedSkill = character.competences[skillIndex];
  if (selectedSkill && character.currentMana >= selectedSkill.coutMana) {
    return { skill: selectedSkill, usedFallback: false };
  }

  const usable = character.competences
    .filter((skill) => character.currentMana >= skill.coutMana)
    .sort((a, b) => a.coutMana - b.coutMana);

  if (usable.length) {
    return { skill: usable[0], usedFallback: true };
  }

  return { skill: buildFallbackSkill(), usedFallback: true };
}

export function performTurn(state, actorSide, skillIndex) {
  const actorKey = actorSide === "player" ? "player" : "enemy";
  const targetKey = actorSide === "player" ? "enemy" : "player";
  const actor = { ...state[actorKey] };
  const target = { ...state[targetKey] };
  const { skill, usedFallback } = resolveSkill(actor, skillIndex);
  const critical = Math.random() < 0.1;
  const damage = computeDamage(actor, target, skill, critical);

  actor.currentMana = Math.max(0, actor.currentMana - skill.coutMana);
  target.currentHp = Math.max(0, target.currentHp - damage);

  const winner = target.currentHp <= 0 ? actorSide : null;

  return {
    state: {
      ...state,
      [actorKey]: actor,
      [targetKey]: target,
      turn: winner ? state.turn : state.turn + 1,
      currentTurn: winner ? actorSide : actorSide === "player" ? "enemy" : "player",
      winner,
      log: [...state.log, describeAction(state.turn, actor, skill, damage, critical, usedFallback)],
    },
    action: {
      actor: actorSide,
      target: actorSide === "player" ? "enemy" : "player",
      skill,
      damage,
      critical,
      usedFallback,
    },
  };
}

export function getAiSkillIndex(enemy) {
  const usableIndexes = enemy.competences
    .map((skill, index) => ({ skill, index }))
    .filter(({ skill }) => enemy.currentMana >= skill.coutMana);

  if (usableIndexes.length) {
    return usableIndexes[Math.floor(Math.random() * usableIndexes.length)].index;
  }

  return 0;
}
