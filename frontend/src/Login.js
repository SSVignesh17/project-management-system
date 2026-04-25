import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, register as apiRegister } from "./api";

export default function Login({ onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("developer");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      const data = await apiLogin(username, password);
      setSuccess("Login successful!");
      onAuthSuccess(data.access_token, data.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      await apiRegister(username, password, userRole);
      setSuccess("Registration successful! You can now log in.");
      setMode("login");
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>{mode === "login" ? "Login" : "Register"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>

        {mode === "register" && (
          <div style={{ marginBottom: "10px" }}>
            <label>Role: </label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            >
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
            </select>
          </div>
        )}

        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
            setSuccess("");
          }}
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
        >
          {mode === "login" ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}
