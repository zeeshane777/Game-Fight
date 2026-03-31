import React from "react";

function CharacterForm({ value, onChange, onSubmit, onCancel, submitLabel }) {
  const handleRootChange = (event) => {
    const { name, value: fieldValue, type, checked } = event.target;
    onChange({
      ...value,
      [name]: type === "checkbox" ? checked : fieldValue,
    });
  };

  const handleStatChange = (event) => {
    const { name, value: fieldValue } = event.target;
    onChange({
      ...value,
      stats: {
        ...value.stats,
        [name]: Number(fieldValue),
      },
    });
  };

  const handleSkillChange = (index, field, fieldValue) => {
    const competences = value.competences.map((skill, skillIndex) =>
      skillIndex === index
        ? {
            ...skill,
            [field]:
              field === "puissance" || field === "coutMana"
                ? Number(fieldValue)
                : fieldValue,
          }
        : skill
    );

    onChange({
      ...value,
      competences,
    });
  };

  return (
    <form className="panel form-panel" onSubmit={onSubmit}>
      <div className="section-title-row">
        <h2>{submitLabel}</h2>
        <button type="button" className="secondary-button" onClick={onCancel}>
          Annuler
        </button>
      </div>

      <div className="form-grid">
        <label>
          Nom
          <input name="nom" value={value.nom} onChange={handleRootChange} required />
        </label>
        <label>
          URL image
          <input name="image" value={value.image} onChange={handleRootChange} required />
        </label>
        <label className="checkbox-field">
          <input
            type="checkbox"
            name="actif"
            checked={value.actif}
            onChange={handleRootChange}
          />
          Personnage actif
        </label>
      </div>

      <div className="stats-form-grid">
        {["vie", "attaque", "defense", "vitesse", "manaMax"].map((stat) => (
          <label key={stat}>
            {stat}
            <input
              type="number"
              min="0"
              name={stat}
              value={value.stats[stat]}
              onChange={handleStatChange}
              required
            />
          </label>
        ))}
      </div>

      <div className="skills-form-grid">
        {value.competences.map((skill, index) => (
          <section key={index} className="skill-editor">
            <h3>Competence {index + 1}</h3>
            <label>
              Nom
              <input
                value={skill.nom}
                onChange={(event) => handleSkillChange(index, "nom", event.target.value)}
                required
              />
            </label>
            <label>
              Type
              <input
                value={skill.type}
                onChange={(event) => handleSkillChange(index, "type", event.target.value)}
                required
              />
            </label>
            <label>
              Puissance
              <input
                type="number"
                min="0"
                value={skill.puissance}
                onChange={(event) =>
                  handleSkillChange(index, "puissance", event.target.value)
                }
                required
              />
            </label>
            <label>
              Cout mana
              <input
                type="number"
                min="0"
                value={skill.coutMana}
                onChange={(event) =>
                  handleSkillChange(index, "coutMana", event.target.value)
                }
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={skill.description}
                onChange={(event) =>
                  handleSkillChange(index, "description", event.target.value)
                }
                rows="3"
                required
              />
            </label>
          </section>
        ))}
      </div>

      <button type="submit" className="primary-button">
        {submitLabel}
      </button>
    </form>
  );
}

export default CharacterForm;
