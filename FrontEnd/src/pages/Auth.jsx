import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import "./Auth.css"; // Import the CSS file

const Auth = ({ isSignup = false }) => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = isSignup ? "/api/v1/users/register" : "/api/v1/users/login";
      const response = await axios.post(`http://localhost:8000${endpoint}`, formData);

      console.log("Response:", response.data);

      if (isSignup) {
        alert("Signup successful! Redirecting to login...");
        navigate("/login"); // ✅ Redirect to login page
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("email", response.data.email);
        alert("Login successful! Redirecting to dashboard...");
        navigate("/dashboard"); // ✅ Redirect to dashboard after login
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <p>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <a href={isSignup ? "/login" : "/signup"}>{isSignup ? "Login" : "Sign Up"}</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
