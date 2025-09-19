import toast from "react-hot-toast";
import React, {useState} from "react";
import {Route, Routes } from "react-router";
import GKServiceRequest from './pages/GKServiceRequest.jsx'
import Checkout from "./components/Checkout.jsx";
import Login from './pages/vd_login.jsx';
import Register from './pages/vd_register.jsx'
import UserProfile from "./pages/vd_userProfile.jsx";
import ResidentList from "./pages/vd_residentList.jsx";
import StaffList from "./pages/vd_staffList.jsx";
import ProfileSettings from "./pages/vd_profileSettings.jsx";
import ProtectedRoute from "./components/vd_protectedRoute.jsx";
import GuestRoute from "./components/vd_guestRoute.jsx";
import { AuthProvider } from "./context/vd_AuthContext.jsx";

const App = () =>{

    return(

        
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKServiceRequest />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:userId" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>}/>
                <Route path="/residentlist" element={<ResidentList/>}/>
                <Route path="/stafflist" element={<StaffList/>}/>
                <Route path="/users/:userId" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            </Routes>

        </div>
       
    );
};

export default App;