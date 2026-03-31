import React, { useCallback, useEffect, useMemo, useState } from "react";
import CharacterCard from "../components/CharacterCard";
import CharacterForm from "../components/CharacterForm";
import { useAuth } from "../context/AuthContext";
import { characterService } from "../services/characterService";

const emptyCharacter = () => ({
  nom: "",
  image: "",
  actif: true,
  stats: {
    vie: 100,
    attaque: 15,
    defense: 10,
    vitesse: 10,
    manaMax: 80,
  },
  competences: new Array(4).fill(null).map(() => ({
    nom: "",
    type: "",
    puissance: 10,
    coutMana: 0,
    description: "",
  })),
});

function AdminCharactersPage() {
  const { token } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const submitLabel = useMemo(
    () =>
      editingCharacter && editingCharacter.id
        ? "Mettre a jour"
        : "Creer le personnage",
    [editingCharacter]
  );

  const loadCharacters = useCallback(async () => {
    setLoading(true);
    try {
      const data = await characterService.getAll(token);
      setCharacters(data);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingCharacter.id) {
        await characterService.update(editingCharacter.id, editingCharacter, token);
      } else {
        await characterService.create(editingCharacter, token);
      }
      setEditingCharacter(null);
      await loadCharacters();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleToggle = async (characterId) => {
    await characterService.toggle(characterId, token);
    await loadCharacters();
  };

  const handleDelete = async (characterId) => {
    await characterService.remove(characterId, token);
    await loadCharacters();
  };

  return (
    <section className="admin-page">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1>Gestion des personnages</h1>
        </div>
        <button className="primary-button" onClick={() => setEditingCharacter(emptyCharacter())}>
          Ajouter un personnage
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {editingCharacter ? (
        <CharacterForm
          value={editingCharacter}
          onChange={setEditingCharacter}
          onSubmit={handleSubmit}
          onCancel={() => setEditingCharacter(null)}
          submitLabel={submitLabel}
        />
      ) : null}

      {loading ? <div className="page-loading">Chargement des personnages...</div> : null}

      <div className="cards-grid">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            compact
            footer={
              <div className="card-actions">
                <button className="secondary-button" onClick={() => setEditingCharacter(character)}>
                  Modifier
                </button>
                <button className="secondary-button" onClick={() => handleToggle(character.id)}>
                  {character.actif ? "Desactiver" : "Activer"}
                </button>
                <button className="danger-button" onClick={() => handleDelete(character.id)}>
                  Supprimer
                </button>
              </div>
            }
          />
        ))}
      </div>
    </section>
  );
}

export default AdminCharactersPage;
