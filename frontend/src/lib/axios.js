import axios from "axios";
import { golbalLogout } from "../context/vd_AuthContext";

const axiosInstance = axios.create({
    baseURL : "http://localhost:5001/api",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401 || error.response.status === 403) {
            
            golbalLogout?.();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;