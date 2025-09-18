import toast from "react-hot-toast";
import React from "react";
import {Route, Routes } from "react-router";
import GKServiceRequest from './pages/GKServiceRequest.jsx'
import Checkout from "./components/Checkout.jsx";
import Login from './pages/vd_login.jsx';
import Register from './pages/vd_register.jsx'
import UserProfile from "./pages/vd_userProfile.jsx";
import ResidentList from "./pages/vd_residentList.jsx";
import StaffList from "./pages/vd_staffList.jsx";

const App = () =>{
    return(

        
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKServiceRequest />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:userId" element={<UserProfile />}/>
                <Route path="/residentlist" element={<ResidentList/>}/>
                <Route path="/stafflist" element={<StaffList/>}/>
                <Route path="/users/:userId" element={<UserProfile />} />
            </Routes>

        </div>
        
    );
};

export default App;