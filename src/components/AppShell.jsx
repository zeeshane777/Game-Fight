import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppShell({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  const showNav =
    isAuthenticated &&
    location.pathname !== "/login" &&
    location.pathname !== "/register";
  const isFightPage = location.pathname === "/fight";
  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <div
      className={`app-shell${isFightPage ? " app-shell-fight" : ""}${isDashboardPage ? " app-shell-home" : ""}`}
    >
      {!isFightPage ? (
        <header className={`topbar${isFightPage ? " topbar-fight" : ""}`}>
          <div>
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="brand">
              GAME FIGHT
            </Link>
          </div>
          {showNav ? (
            <div className="topbar-actions">
              <span className="badge">{user.role}</span>
              {user.role === "ADMIN" ? (
                <Link to="/admin/characters" className="nav-link">
                  Combattants
                </Link>
              ) : null}
              <Link to="/dashboard" className="nav-link">
                Accueil
              </Link>
              <Link to="/selection" className="nav-link">
                Combattre
              </Link>
              <button className="secondary-button" onClick={handleLogout}>
                Deconnexion
              </button>
            </div>
          ) : null}
        </header>
      ) : null}
      <main className={`app-content${isFightPage ? " app-content-fight" : ""}`}>{children}</main>
    </div>
  );
}

export default AppShell;
