import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({Component,...rest})
{
    const {currentUser}=useAuth();
    
    return currentUser?<Component {...rest}/> : <Navigate to="/login"/>
}