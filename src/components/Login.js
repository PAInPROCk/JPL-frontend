import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login =()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) =>{
        e.preventDefault();
         if (email === "admin@example.com" && password === "1234") {
        navigate('/home');
         }
    };

    return (
        <div className="container d-flex justify-content-center align-itmes-center vh-100 login-bg">
            <form onSubmit={handleLogin} className="border p-4 rounded shadow login-form">
                <h2 className="text-center mb-4">Login to JPL</h2>
                <div className="mb-3">
                    <label>Email</label>
                    <input 
                        type="email"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input 
                        type="password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
};

export default Login;