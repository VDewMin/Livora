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

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    golbalLogout = logout;

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);