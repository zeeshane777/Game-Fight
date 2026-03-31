import React, { useEffect, useState } from "react";

function FighterPanel({ fighter, side, active, attacking, hit, attackEffect }) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [fighter.image]);

  return (
    <section
      className={`fighter-panel ${side}${active ? " active" : ""}${attacking ? " attacking" : ""}${
        hit ? " hit" : ""
      }`}
    >
      <div className={`fighter-figure${attackEffect ? ` strike-${attackEffect}` : ""}`}>
        {attacking && attackEffect ? <div className={`fighter-strike strike-${attackEffect}`} /> : null}
        {hasImageError ? (
          <div className="fighter-sprite fighter-fallback">
            <span>{fighter.nom}</span>
          </div>
        ) : (
          <img
            className={`fighter-sprite sprite-${side}`}
            src={fighter.image}
            alt={fighter.nom}
            loading="eager"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              setHasImageError(true);
            }}
          />
        )}
      </div>
    </section>
  );
}

export default FighterPanel;
