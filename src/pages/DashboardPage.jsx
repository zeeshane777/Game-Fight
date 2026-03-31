import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { startMenuMusic, stopMenuMusic } from "../utils/audioEngine";

function DashboardPage() {
  const { user } = useAuth();
  const embers = useMemo(
    () =>
      Array.from({ length: 40 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        duration: `${4 + Math.random() * 6}s`,
        delay: `${Math.random() * 8}s`,
        drift: `${Math.random() * 100 - 50}px`,
        size: `${2 + Math.random() * 4}px`,
        color:
          index % 3 === 0 ? "#0088ff" : index % 3 === 1 ? "#44aaff" : "#0044cc",
      })),
    []
  );

  useEffect(() => {
    startMenuMusic();
    return () => {
      stopMenuMusic();
    };
  }, []);

  return (
    <section className="dashboard-page dashboard-home">
      <div className="home-embers" aria-hidden="true">
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

      <section className="home-hero">
        <div className="hero-badge">Street Fight</div>
        <h1>
          Game
          <br />
          Fight
        </h1>
        <p className="hero-sub">Que le sang coule</p>
        <div className="home-divider" />
        <p className="hero-desc">
          Choisis ton guerrier, affronte des adversaires generes aleatoirement
          et grave ton nom dans l'arene. Chaque combat est unique. Chaque
          victoire laisse une trace.
        </p>
        <div className="btn-group home-btn-group">
          <Link className="btn-primary" to="/selection">
            Combattre
          </Link>
          {user.role === "ADMIN" ? (
            <Link className="btn-secondary" to="/admin/characters">
              Gerer le roster
            </Link>
          ) : (
            <Link className="btn-secondary" to="/selection">
              Voir les combattants
            </Link>
          )}
        </div>
        <div className="home-player-line">
          <span>Joueur : {user.name}</span>
          <span>Role : {user.role}</span>
        </div>
      </section>

      <div className="features">
        {user.role === "ADMIN" ? (
          <article className="feature-card">
            <span className="feature-icon" aria-hidden="true">
              CTRL
            </span>
            <h2 className="feature-title">Administration</h2>
            <p className="feature-desc">
              Modifie le roster, ajuste les statistiques, active ou desactive
              les combattants et leurs competences.
            </p>
            <Link className="btn-secondary feature-link" to="/admin/characters">
              Ouvrir
            </Link>
          </article>
        ) : null}

        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            VS
          </span>
          <h2 className="feature-title">Mode Combat</h2>
          <p className="feature-desc">
            Choisis un personnage actif puis lance un duel contre l'IA avec
            critiques, sons d'impact et animations visibles.
          </p>
          <Link className="btn-primary feature-link" to="/selection">
            Entrer
          </Link>
        </article>

        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            HIT
          </span>
          <h2 className="feature-title">Arcade</h2>
          <p className="feature-desc">
            Interface versus, ambiance d'arene, musique d'accueil et rythme
            inspire des jeux de combat classiques.
          </p>
        </article>

        <article className="feature-card">
          <span className="feature-icon" aria-hidden="true">
            ID
          </span>
          <h2 className="feature-title">Profil</h2>
          <p className="feature-desc">
            Connecte en tant que {user.name}. Prepare ton prochain round et
            entre dans l'arene.
          </p>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;
