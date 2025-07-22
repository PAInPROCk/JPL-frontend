import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("false");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (email === "admin@example.com" && password === "1234") {
        localStorage.setItem("isLoggedIn","true");
        setError("");
        navigate("/home");
      } else {
        setError("Incorrect email or password");
      }
    }, 100);
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
      loading="Login";
    }
  }, [error]);

  return (
    <div className="login-bg">
        
      <div className="container d-flex justify-content-center align-itmes-center vh-100 ">
        <form
          onSubmit={handleLogin}
          className="border border-black p-4 rounded shadow login-form text-color"
        >
            {error && (
            <div className="alert alert-danger mt-0" role="alert">
              {error}
            </div>
          )}
          <h2 className="text-center mb-4">Login to JPL</h2>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            
          </div>
          
          <button
            type="submit"
            className="btn btn-color border border-1 border-black w-100"
            onClick={() => setShowPassword(!showPassword)}
          >
            {loading ? "Login" : "Loging in..."}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
