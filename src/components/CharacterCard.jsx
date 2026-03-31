import React from "react";

function CharacterCard({ character, selected, onSelect, footer, compact }) {
  return (
    <article
      className={`character-card${selected ? " selected" : ""}${
        compact ? " compact" : ""
      }`}
    >
      <div className="character-card-art">
        <img src={character.image} alt={character.nom} />
      </div>
      <div className="character-card-body">
        <div className="character-card-top">
          <div>
            <h3>{character.nom}</h3>
            <p>{character.actif ? "Actif" : "Desactive"}</p>
          </div>
          <span className="badge">{character.stats.vitesse} SPD</span>
        </div>
        <div className="stats-grid">
          <span>HP {character.stats.vie}</span>
          <span>ATK {character.stats.attaque}</span>
          <span>DEF {character.stats.defense}</span>
          <span>MP {character.stats.manaMax}</span>
        </div>
        <ul className="skills-list">
          {character.competences.map((skill) => (
            <li key={skill.nom}>
              <strong>{skill.nom}</strong>
              <span>
                {skill.type} | {skill.puissance} pow | {skill.coutMana} mana
              </span>
            </li>
          ))}
        </ul>
        {onSelect ? (
          <button className="primary-button full-width" onClick={() => onSelect(character)}>
            {selected ? "Selectionne" : "Choisir"}
          </button>
        ) : null}
        {footer || null}
      </div>
    </article>
  );
}

export default CharacterCard;
