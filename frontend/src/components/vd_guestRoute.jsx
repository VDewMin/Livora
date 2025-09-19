import { Navigate } from "react-router-dom";
import { useAuth } from "../context/vd_AuthContext";

const GuestRoute = ({ children}) => {
    const {user, loading} = useAuth();

    if(loading){
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if(user){
        return <Navigate to={`/profile/${user._id}`} replace />;
    }

    return children;
};

export default GuestRoute;