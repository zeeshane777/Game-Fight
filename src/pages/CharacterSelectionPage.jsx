import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";
import { useAuth } from "../context/AuthContext";
import { characterService } from "../services/characterService";

function CharacterSelectionPage() {
  const history = useHistory();
  const { token } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const embers = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        duration: `${5 + Math.random() * 6}s`,
        delay: `${Math.random() * 6}s`,
        drift: `${Math.random() * 90 - 45}px`,
        size: `${2 + Math.random() * 3}px`,
        color:
          index % 3 === 0 ? "#0088ff" : index % 3 === 1 ? "#44aaff" : "#0044cc",
      })),
    []
  );

  useEffect(() => {
    async function loadCharacters() {
      try {
        const data = await characterService.getActive(token);
        setCharacters(data);
        setSelectedCharacter(data[0] || null);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
  }, [token]);

  const launchFight = () => {
    const opponents = characters.filter((character) => character.id !== selectedCharacter.id);
    const enemyPool = opponents.length ? opponents : characters;
    const enemy = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    const selection = { player: selectedCharacter, enemy };
    sessionStorage.setItem("gameFightSelection", JSON.stringify(selection));
    history.push("/fight");
  };

  if (loading) {
    return <div className="page-loading">Chargement des combattants...</div>;
  }

  return (
    <section className="selection-page selection-page-arcade">
      <div className="home-embers selection-embers" aria-hidden="true">
        {embers.map((ember) => (
          <span
            key={ember.id}
            className="home-ember"
            style={{
              left: ember.left,
              animationDuration: ember.duration,
              animationDelay: ember.delay,
              width: ember.size,
              height: ember.size,
              background: ember.color,
              boxShadow: `0 0 6px ${ember.color}, 0 0 12px ${ember.color}`,
              "--ember-drift": ember.drift,
            }}
          />
        ))}
      </div>
      <section className="selection-hero">
        <div className="section-title-row selection-title-row">
          <div>
            <p className="eyebrow">JOUEUR VS IA</p>
            <h1>Choisis ton combattant</h1>
          </div>
          <button
            className="primary-button"
            onClick={launchFight}
            disabled={!selectedCharacter || characters.length === 0}
          >
            Lancer le combat
          </button>
        </div>
        <p className="selection-hint">
          Seuls les personnages actifs decides par l'admin sont selectionnables.
        </p>
      </section>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="cards-grid">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            selected={selectedCharacter && selectedCharacter.id === character.id}
            onSelect={setSelectedCharacter}
          />
        ))}
      </div>
    </section>
  );
}

export default CharacterSelectionPage;
