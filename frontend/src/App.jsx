import React from "react";
import {Route, Routes } from "react-router";
import GKViewServices from './pages/GKViewServices.jsx'
import GKUpdateService from './pages/GKUpdateService.jsx'
import GKDeleteService from './pages/GKDeleteService.jsx'
import GKRequestService from './pages/GKRequestService.jsx';
import GKServiceRequest from './pages/GKServiceRequest.jsx'
import Checkout from "./pages/SN_Checkout.jsx";
import Success from "./pages/SN_Success.jsx";
import Cancel from "./pages/SN_Cancel.jsx";
import VerifyOTP from "./pages/SN_VerifyOTP.jsx";

const App = () =>{
    return(
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKViewServices />} />
                <Route path="/update-service/:id" element={<GKUpdateService />} />
                <Route path="/delete-service/:id" element={<GKDeleteService />} />
                <Route path="/add-service" element={<GKRequestService />} />
                <Route path="/" element={<GKServiceRequest />} />
                <Route path="/chekout" element={<Checkout/>} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
            </Routes>

        </div>
        
    );
};

export default App;