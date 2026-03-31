import React from "react";

function CombatLog({ entries }) {
  return (
    <section className="panel combat-log">
      <div className="section-title-row">
        <h2>Fight Feed</h2>
        <span className="badge">{entries.length} events</span>
      </div>
      <div className="combat-log-list">
        {entries.map((entry, index) => (
          <p key={`${entry}-${index}`}>{entry}</p>
        ))}
      </div>
    </section>
  );
}

export default CombatLog;
