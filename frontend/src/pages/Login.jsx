import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Sign In</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        value={email}
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        value={password}
        placeholder="••••••••"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}

export default Login;
