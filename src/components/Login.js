import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); 

  const handleLogin = async(e) => {
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
    
    try{
      const res = await axios.post(
        "http://localhost:5000/login",
        {email, password},
        {withCredentials: true}
      )
      console.log("Login response:",res?.data);
      if(res?.data?.authenticated){
        if(res.data.role === "admin"){
            navigate("/admin");
        } else if(res.data.role === "team"){
          navigate("/home");
        } else{
          navigate("/");
        }
      }else{
        setError("Authentication Failed");
      }
    }catch(err){
      console.error("Login Error: ",err.response?.data || err);
      setError(err.response?.data?.error || "Login Failed");
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
          >
            {loading ? "Loging in...." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;