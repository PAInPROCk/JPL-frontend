import { Navigate } from "react-router-dom";
import React,{useEffect, useState} from "react";
import axios from "axios";
import Spinner from "../components/Spinner.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try{
        const res = await axios.get("http://localhost:5000/check-auth",{
          withCredentials: true,
        });
        if(res.data.authenticated){
          setIsAuth(true);
          setUserRole(res.data.role);
        } else{
          setIsAuth(false);
        }
      }catch(err){
        setIsAuth(false);
      } finally{
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if(isAuth === null) return <><Spinner/> <p>Loading...</p></>;

  if(!isAuth) return <Navigate to="/"/>;

  if(allowedRoles && !allowedRoles.includes(userRole)){
    return <Navigate to="/"/>
  }
  return children;
};

export default ProtectedRoute;
