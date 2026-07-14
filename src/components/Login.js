import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { api } from "../Config";
import { useAuth } from "../context/AuthContext";

const initialState = {
  email: "",
  password: "",
  error: "",
  loading: false,
  showPassword: false,
};

function loginReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    default:
      return state;
  }
}

const Login = () => {
  const { refreshAuth } = useAuth();   // ✅ correct place
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { email, password, error, loading, showPassword } = state;

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_ERROR", error: "" });

    if (!email || !password) {
      dispatch({ type: "SET_ERROR", error: "Please fill all fields" });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      dispatch({ type: "SET_ERROR", error: "Invalid email format" });
      return;
    }

    dispatch({ type: "SET_LOADING", loading: true });

    try {
      const res = await api.post("/login", { email, password }, {withCredentials: true});

      // console.log("Login response:", res.data);

      if (res.data.user) {
        await refreshAuth(); // 🔥 sync global auth state

        if (res.data.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } else {
        dispatch({ type: "SET_ERROR", error: "Authentication Failed" });
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      dispatch({ type: "SET_ERROR", error: err.response?.data?.detail || "Login Failed" });
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch({ type: "SET_ERROR", error: "" }), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="login-bg">
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <form
          onSubmit={handleLogin}
          className="border border-black p-4 rounded shadow login-form"
        >
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <h2 className="text-center mb-4">Login to JPL</h2>

          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })}
              required
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mt-1"
              onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
