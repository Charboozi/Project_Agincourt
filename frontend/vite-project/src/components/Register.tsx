import React, { useState } from "react";
import api from "../api/api";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [x, setX] = useState<string>("");
  const [y, setY] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleRegister = async () => {
    try {
      const response = await api.post("/auth/register", {
        username,
        password,
        x: parseFloat(x),
        y: parseFloat(y),
      });
      setMessage(`Registration successful: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      <input
        type="number"
        placeholder="X Coordinate"
        value={x}
        onChange={(e) => setX(e.target.value)}
      />
      <input
        type="number"
        placeholder="Y Coordinate"
        value={y}
        onChange={(e) => setY(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p style={{ color: "blue" }}>{message}</p>
    </div>
  );
};

export default Register;
