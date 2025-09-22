import {Route, Routes } from "react-router";
import toast from "react-hot-toast";
import React, {useState} from "react";

import GKViewServices from './pages/GKViewServices.jsx'
import GKUpdateService from './pages/GKUpdateService.jsx'
import GKDeleteService from './pages/GKDeleteService.jsx'
import GKRequestService from './pages/GKRequestService.jsx';

import Checkout from "./components/Checkout.jsx";

import Login from './pages/vd_login.jsx';
import Register from './pages/vd_register.jsx'
import ResidentList from "./pages/vd_residentList.jsx";
import StaffList from "./pages/vd_staffList.jsx";
import ProfileSettings from "./pages/vd_profileSettings.jsx";
import ProtectedRoute from "./components/vd_protectedRoute.jsx";
import GuestRoute from "./components/vd_guestRoute.jsx";
import VerifyOtp from "./pages/vd_verifyOtp.jsx";

const App = () =>{

    return(

        
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKViewServices />} />
                <Route path="/update-service/:id" element={<GKUpdateService />} />
                <Route path="/delete-service/:id" element={<GKDeleteService />} />
                <Route path="/add-service" element={<GKRequestService />} />
                
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/verify-otp/:userId" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
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