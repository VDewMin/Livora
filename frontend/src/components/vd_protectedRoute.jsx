import { Navigate } from "react-router-dom";
import { useAuth } from "../context/vd_AuthContext";

const ProtectedRoute = ({ children, allowedRoles}) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if(!user) {
        return <Navigate to ="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but doesn’t have permission → go to Unauthorized
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;