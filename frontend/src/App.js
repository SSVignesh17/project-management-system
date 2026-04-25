import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./styles.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("pms_token") || "");
  const [role, setRole] = useState(localStorage.getItem("pms_role") || "");

  useEffect(() => {
    localStorage.setItem("pms_token", token);
    localStorage.setItem("pms_role", role);
  }, [token, role]);

  const handleAuthSuccess = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
  };

  const handleLogout = () => {
    setToken("");
    setRole("");
    localStorage.removeItem("pms_token");
    localStorage.removeItem("pms_role");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard token={token} role={role} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
