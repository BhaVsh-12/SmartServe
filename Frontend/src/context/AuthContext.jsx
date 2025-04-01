import { createContext, useState } from "react";
import axios from "axios";
import api from "../Api/capi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password, userType) => {
        try {
            const response = await api.post(`/${userType}/api/auth/login`, { email, password });
            setUser({ ...response.data, type: userType });
            localStorage.setItem("token", response.data.token);
            return response.data.role;
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message);
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
