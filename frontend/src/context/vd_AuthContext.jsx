import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export let golbalLogout;

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(() =>{

        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem("authToken") || null);
    const [loading, setLoading] = useState(true);

    const updateUser = (newUserData) => {
        setUser((prev) => ({
            ...prev,
            ...newUserData,
            // Force cache-bust for avatar consumers when profile picture changes
            avatarVersion:
                newUserData && Object.prototype.hasOwnProperty.call(newUserData, "profilePicture")
                    ? Date.now()
                    : prev?.avatarVersion,
            updatedAt: new Date().toISOString(),
        }));
    };


    useEffect(() => {

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }else{
            localStorage.removeItem("user");
        }

        if(token){
            localStorage.setItem("authToken", token);
        }else{
            localStorage.removeItem("authToken");
        }

        setLoading(false);

    }, [user, token]);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
    };

    const logout = (redirect = true) => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        if (redirect) {
            window.location.href = "/login";
        }
    };

    golbalLogout = logout;

    return (
        <AuthContext.Provider value={{user, token, login, logout, setUser, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);