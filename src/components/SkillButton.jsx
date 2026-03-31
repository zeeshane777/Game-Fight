import React from "react";

function SkillButton({ skill, disabled, onClick, compact = false }) {
  return (
    <button className={`skill-button${compact ? " compact" : ""}`} disabled={disabled} onClick={onClick}>
      <strong>{skill.nom}</strong>
      {compact ? (
        <small>
          {skill.type.toUpperCase()} | {skill.coutMana} mana | P {skill.puissance}
        </small>
      ) : (
        <>
          <span>{skill.type.toUpperCase()}</span>
          <small>{skill.coutMana} mana</small>
          <small>Puissance {skill.puissance}</small>
          <p>{skill.description}</p>
        </>
      )}
    </button>
  );
}

export default SkillButton;
