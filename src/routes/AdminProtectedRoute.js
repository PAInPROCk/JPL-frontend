import React, {Children, useEffect, useState} from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const AdminProtectedRoute = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const checkAuth = async() =>{
            try{
                const res = await axios.get("http://localhost:5000/check-auth",{
                    withCredentials: true,

                })
                setIsAuthenticated(res.data.authenticated);
                setIsAdmin(res.data.role === "admin");
            }catch(err){
                setIsAuthenticated(false);
                setIsAdmin(false);
            }finally{
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if(loading){
        return <Spinner/>;
    }

    if(!isAuthenticated || !isAdmin){
        return <Navigate to="/login" replace/>;
    }
    return children;
};

export default AdminProtectedRoute;