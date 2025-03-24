import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    // 🔒 Redirect to home if user is not logged in
    if (!token) {
        return <Navigate to="/" />;
    }

    // 🔒 Ensure user has the correct role
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
