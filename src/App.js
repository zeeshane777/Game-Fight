import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCharactersPage from "./pages/AdminCharactersPage";
import CharacterSelectionPage from "./pages/CharacterSelectionPage";
import DashboardPage from "./pages/DashboardPage";
import FightArenaPage from "./pages/FightArenaPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AppShell>
      <Switch>
        <Route path="/login" component={LoginPage} exact />
        <Route path="/register" component={RegisterPage} exact />
        <ProtectedRoute path="/dashboard" component={DashboardPage} exact />
        <ProtectedRoute
          path="/admin/characters"
          component={AdminCharactersPage}
          roles={["ADMIN"]}
          exact
        />
        <ProtectedRoute
          path="/selection"
          component={CharacterSelectionPage}
          roles={["JOUEUR", "ADMIN"]}
          exact
        />
        <ProtectedRoute
          path="/fight"
          component={FightArenaPage}
          roles={["JOUEUR", "ADMIN"]}
          exact
        />
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </AppShell>
  );
}

export default App;
