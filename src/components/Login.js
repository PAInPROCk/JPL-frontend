import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { api } from "../Config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("🔐 Login button clicked");


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

    try {
      const res = await api.post(
        "/login",
        { email, password });

      console.log("✅ Login API raw response:", res);
      console.log("Login response:", res.data);
      console.log("✅ authenticated:", res.data?.authenticated);
      console.log("✅ role:", res.data?.role);

      if(res.data?.authenticated){
        if(res.data.role === "admin"){
          console.log("➡️ Navigating to /admin");
          navigate("/admin",{replace : true});
        } else if (res.data.role === "team") {
          console.log("➡️ Navigating to /home");
          navigate("/home",{replace: true});
        }else{
          console.log("⚠️ Role unknown, navigating to /");
          navigate("/", {replace: true});
        }
      } else{
        console.log("❌ Authentication failed according to response");
        setError("Authentication Failed");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      setError(err.response?.data?.detail || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await api.get("/check-auth");
      if (res.data.authenticated) {
        if (res.data.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }
    } catch {
      // not logged in → stay on login
    }
  };

  checkAuth();
}, [navigate]);


  return (
    <div className="login-bg">

      <div className="container d-flex justify-content-center align-items-center vh-100 ">
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
              className="btn btn-outline-secondary btn-bg"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-color border border-1 border-black w-100"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;