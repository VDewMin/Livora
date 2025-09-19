import React from "react";
import {Route, Routes } from "react-router";
import toast from "react-hot-toast";
import React, {useState} from "react";

import GKViewServices from './pages/GKViewServices.jsx'
import GKUpdateService from './pages/GKUpdateService.jsx'
import GKDeleteService from './pages/GKDeleteService.jsx'
import GKRequestService from './pages/GKRequestService.jsx';
import Checkout from "./pages/SN_Checkout.jsx";
import Success from "./pages/SN_Success.jsx";
import Cancel from "./pages/SN_Cancel.jsx";
import VerifyOTP from "./pages/SN_VerifyOTP.jsx";
import OfflineSlipForm from "./pages/SN_SlipuploadForm.jsx";
import PaymentHistory from "./pages/SN_PaymentHistory.jsx";
import PaymentDetail from "./pages/SN_PaymentDetail.jsx";
import ExpensePage from "./pages/SN_ExpensePage.jsx";

import Checkout from "./components/Checkout.jsx";

import Login from './pages/vd_login.jsx';
import Register from './pages/vd_register.jsx'
import ResidentList from "./pages/vd_residentList.jsx";
import StaffList from "./pages/vd_staffList.jsx";
import ProfileSettings from "./pages/vd_profileSettings.jsx";
import ProtectedRoute from "./components/vd_protectedRoute.jsx";
import GuestRoute from "./components/vd_guestRoute.jsx";

const App = () =>{

    return(

        
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKViewServices />} />
                <Route path="/update-service/:id" element={<GKUpdateService />} />
                <Route path="/delete-service/:id" element={<GKDeleteService />} />
                <Route path="/add-service" element={<GKRequestService />} />
            </Routes>

        </div>
       
    );
};

export default App;