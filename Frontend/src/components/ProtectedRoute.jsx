import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" />;
    }
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
