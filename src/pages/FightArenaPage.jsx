import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import FighterPanel from "../components/FighterPanel";
import SkillButton from "../components/SkillButton";
import { playHitSound, stopMenuMusic } from "../utils/audioEngine";
import { createBattleState, getAiSkillIndex, performTurn } from "../utils/fightEngine";

const backgroundImage = require("../assets/coliseum-arena.webp");

function FightArenaPage() {
  const selection = useMemo(() => {
    const saved = sessionStorage.getItem("gameFightSelection");
    return saved ? JSON.parse(saved) : null;
  }, []);

  const [battleState, setBattleState] = useState(
    selection ? createBattleState(selection.player, selection.enemy) : null
  );
  const [animationState, setAnimationState] = useState({
    attacker: null,
    target: null,
    effect: null,
    skillName: "",
  });
  const [showReadyOverlay, setShowReadyOverlay] = useState(true);
  const [statusText, setStatusText] = useState("Le combat est pret.");
  const aiTimeoutRef = useRef(null);
  const currentTurn = battleState ? battleState.currentTurn : null;
  const currentRound = battleState ? battleState.turn : null;
  const winner = battleState ? battleState.winner : null;

  const resolveAttackEffect = useCallback((skill) => {
    if (!skill) {
      return "melee";
    }

    const attackText = `${skill.nom || ""} ${skill.type || ""} ${skill.description || ""}`.toLowerCase();

    if (skill.animation) {
      return skill.animation;
    }

    if (
      skill.type === "energie" ||
      skill.type === "feu" ||
      attackText.includes("hadouken") ||
      attackText.includes("shot") ||
      attackText.includes("slash")
    ) {
      return "projectile";
    }

    if (
      skill.type === "uppercut" ||
      skill.type === "aerien" ||
      skill.type === "counter" ||
      attackText.includes("shoryu") ||
      attackText.includes("uppercut")
    ) {
      return "uppercut";
    }

    if (
      attackText.includes("kick") ||
      attackText.includes("sobat") ||
      attackText.includes("drill") ||
      attackText.includes("cannon")
    ) {
      return "kick";
    }

    if (
      attackText.includes("punch") ||
      attackText.includes("poing") ||
      attackText.includes("jab") ||
      attackText.includes("fist")
    ) {
      return "punch";
    }

    if (skill.type === "ultime") {
      return "ultimate";
    }

    return "punch";
  }, []);

  const clearAiTimeout = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
  }, []);

  const performAiTurn = useCallback(() => {
    setBattleState((currentState) => {
      if (!currentState || currentState.winner || currentState.currentTurn !== "enemy") {
        return currentState;
      }

      const aiSkillIndex = getAiSkillIndex(currentState.enemy);
      const outcome = performTurn(currentState, "enemy", aiSkillIndex);

      setAnimationState({
        attacker: outcome.action.actor,
        target: outcome.action.target,
        effect: resolveAttackEffect(outcome.action.skill),
        skillName: outcome.action.skill.nom,
      });

      setStatusText(
        outcome.state.winner
          ? `${outcome.state.enemy.nom} remporte le combat.`
          : "A toi de jouer."
      );

      setTimeout(() => {
        setAnimationState({ attacker: null, target: null, effect: null, skillName: "" });
      }, 520);

      aiTimeoutRef.current = null;
      return outcome.state;
    });
  }, [resolveAttackEffect]);

  const scheduleAiTurn = useCallback(() => {
    clearAiTimeout();
    setStatusText("L'IA prepare son attaque...");
    aiTimeoutRef.current = setTimeout(() => {
      performAiTurn();
    }, 850);
  }, [clearAiTimeout, performAiTurn]);

  useEffect(() => {
    stopMenuMusic();
    const introTimeout = setTimeout(() => {
      setShowReadyOverlay(false);
    }, 1600);

    return () => clearTimeout(introTimeout);
  }, []);

  useEffect(() => {
    if (animationState.effect) {
      playHitSound(animationState.effect);
    }
  }, [animationState.effect]);

  useEffect(() => {
    if (battleState && !winner && currentTurn === "enemy") {
      scheduleAiTurn();
    }

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [
    battleState,
    currentTurn,
    currentRound,
    winner,
    scheduleAiTurn,
  ]);

  const handleTurn = (actor, skillIndex) => {
    clearAiTimeout();
    setBattleState((currentState) => {
      if (!currentState || currentState.winner || currentState.currentTurn !== actor) {
        return currentState;
      }

      const outcome = performTurn(currentState, actor, skillIndex);
      setStatusText(
        outcome.state.winner
          ? `${outcome.state.winner === "player" ? outcome.state.player.nom : outcome.state.enemy.nom} remporte le combat.`
          : outcome.state.currentTurn === "player"
          ? "A toi de jouer."
          : "Tour de l'IA."
      );
      setAnimationState({
        attacker: outcome.action.actor,
        target: outcome.action.target,
        effect: resolveAttackEffect(outcome.action.skill),
        skillName: outcome.action.skill.nom,
      });
      setTimeout(() => {
        setAnimationState({ attacker: null, target: null, effect: null, skillName: "" });
      }, 520);
      return outcome.state;
    });
  };

  if (!selection || !battleState) {
    return <Redirect to="/selection" />;
  }

  const player = battleState.player;
  const enemy = battleState.enemy;
  const playerHpPercent = (player.currentHp / player.stats.vie) * 100;
  const enemyHpPercent = (enemy.currentHp / enemy.stats.vie) * 100;
  const winnerName =
    battleState.winner === "player"
      ? player.nom
      : battleState.winner === "enemy"
      ? enemy.nom
      : null;

  return (
    <section className="fight-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="fight-overlay">
        <div className="fight-stage">
          <header className="fight-hud">
            <div className={`vs-health-panel player ${battleState.currentTurn === "player" ? "active" : ""}`}>
              <div className="vs-health-heading">
                <span className="vs-player-tag">P1</span>
                <div className="vs-name-block">
                  <p className="eyebrow">Player One</p>
                  <h2>{player.nom}</h2>
                </div>
              </div>
              <div className="vs-health-shell player">
                <div className="vs-health-lights" />
                <div className="vs-health-track">
                  <div className="vs-health-fill player" style={{ width: `${playerHpPercent}%` }} />
                </div>
              </div>
              <div className="vs-hud-meta">
                <span className="vs-life-readout">{player.currentHp}/{player.stats.vie}</span>
                <div className="vs-hud-stats">
                  <span>Mana {player.currentMana}/{player.stats.manaMax}</span>
                  <span>ATK {player.stats.attaque}</span>
                </div>
              </div>
            </div>

            <div className="vs-center-panel">
              <div className="vs-center-top">Round {battleState.turn}</div>
              <div className="vs-center-bottom">
                {winnerName
                  ? `Victoire ${winnerName}`
                  : battleState.currentTurn === "player"
                  ? `Tour ${player.nom}`
                  : "Tour IA"}
              </div>
            </div>

            <div className={`vs-health-panel enemy ${battleState.currentTurn === "enemy" ? "active" : ""}`}>
              <div className="vs-health-heading enemy">
                <div className="vs-name-block enemy">
                  <p className="eyebrow">CPU Battle</p>
                  <h2>{enemy.nom}</h2>
                </div>
                <span className="vs-player-tag">P2</span>
              </div>
              <div className="vs-health-shell enemy">
                <div className="vs-health-lights enemy" />
                <div className="vs-health-track enemy">
                  <div className="vs-health-fill enemy" style={{ width: `${enemyHpPercent}%` }} />
                </div>
              </div>
              <div className="vs-hud-meta enemy">
                <span className="vs-life-readout">{enemy.currentHp}/{enemy.stats.vie}</span>
                <div className="vs-hud-stats enemy">
                  <span>Mana {enemy.currentMana}/{enemy.stats.manaMax}</span>
                  <span>SPD {enemy.stats.vitesse}</span>
                </div>
              </div>
            </div>
          </header>

          <p className="fight-status">{statusText}</p>

          <div className="fight-layout single-stage">
            <div className="arena-panels">
              {showReadyOverlay && !battleState.winner ? (
                <div className="ready-overlay" aria-hidden="true">
                  <span>READY</span>
                </div>
              ) : null}
              {animationState.effect ? (
                <div
                  className={`attack-effect attack-effect-${animationState.effect} attack-from-${animationState.attacker}`}
                >
                  <span className="attack-effect-label">{animationState.skillName}</span>
                  <div className="attack-core" />
                  <div className="attack-trail" />
                  <div className="attack-burst" />
                </div>
              ) : null}
              <FighterPanel
                fighter={player}
                side="player"
                active={battleState.currentTurn === "player"}
                attacking={animationState.attacker === "player"}
                hit={animationState.target === "player"}
                attackEffect={animationState.attacker === "player" ? animationState.effect : null}
              />
              {!showReadyOverlay ? <div className="versus-column" aria-hidden="true" /> : null}
              <FighterPanel
                fighter={enemy}
                side="enemy"
                active={battleState.currentTurn === "enemy"}
                attacking={animationState.attacker === "enemy"}
                hit={animationState.target === "enemy"}
                attackEffect={animationState.attacker === "enemy" ? animationState.effect : null}
              />

              <section className="command-overlay" aria-label="Command List">
                <div className="command-overlay-list">
                  {player.competences.slice(0, 4).map((skill, index) => (
                    <SkillButton
                      key={skill.nom}
                      skill={skill}
                      compact
                      disabled={
                        battleState.currentTurn !== "player" ||
                        Boolean(battleState.winner) ||
                        player.currentMana < skill.coutMana
                      }
                      onClick={() => handleTurn("player", index)}
                    />
                  ))}
                </div>
                {battleState.winner ? (
                  <div className="command-overlay-actions">
                    <Link className="secondary-button" to="/selection">
                      Changer
                    </Link>
                    <button
                      className="primary-button"
                      onClick={() => {
                        clearAiTimeout();
                        const restartedState = createBattleState(selection.player, selection.enemy);
                        setAnimationState({ attacker: null, target: null, effect: null, skillName: "" });
                        setShowReadyOverlay(true);
                        setStatusText("Le combat redemarre.");
                        setBattleState(restartedState);
                        setTimeout(() => setShowReadyOverlay(false), 1600);
                      }}
                    >
                      Rejouer
                    </button>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FightArenaPage;
