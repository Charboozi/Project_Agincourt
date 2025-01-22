import React, { useState } from "react";
import api from "../api/api";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const token = response.data.token;

      // Save the token to localStorage
      localStorage.setItem("token", token);

      setMessage("Login successful!");
    } catch (error: any) {
      setMessage(`Login error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p style={{ color: "blue" }}>{message}</p>
    </div>
  );
};

export default Login;
