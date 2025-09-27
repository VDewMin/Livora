import toast from "react-hot-toast";
import React from "react";
import {Route, Routes } from "react-router";
import GKServiceRequest from './pages/GKServiceRequest.jsx'
import KsViewParcels from "./pages/KsViewParcels.jsx"
import KsAddParcel from "./pages/KsAddParcel.jsx";
import KsParcelDetail from "./pages/KsParcelDetail.jsx"
import SecurityDashboard from "./pages/SecurityDashboard.jsx";



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
import AdminBillingDashboard from "./pages/SN_AdminBillingDashboard.jsx";
import ResidentBillingPage from "./pages/SN_ResidentBillingDashboard.jsx";

import Login from "./pages/vd_login.jsx";
import GuestRoute from "./components/vd_guestRoute.jsx";
import Register from './pages/vd_register.jsx'
import ResidentList from "./pages/vd_residentList.jsx";
import StaffList from "./pages/vd_staffList.jsx";
import ProfileSettings from "./pages/vd_profileSettings.jsx";
import ProtectedRoute from "./components/vd_protectedRoute.jsx";
import VerifyOtp from "./pages/vd_verifyOtp.jsx";
import GKAdminViewServices from './pages/GKAdminViewServices.jsx';
import KsSecurityDashboard from "./pages/KsSecurityDashboard.jsx";
import KsScanner from "./pages/KsScanner.jsx";


const App = () =>{
    return(
        <div className="p-4">
            <Routes>
                 <Route path="/" element={<GKViewServices />} />
                <Route path="/update-service/:id" element={<GKUpdateService />} />
                <Route path="/delete-service/:id" element={<GKDeleteService />} />
                <Route path="/add-service" element={<GKRequestService />} />
                 <Route path="/" element={<GKServiceRequest />} />
                <Route path="/admin-view" element={<GKAdminViewServices />} />
                
                <Route path="/chekout" element={<Checkout/>} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/offline-slip" element={<OfflineSlipForm />} />
                <Route path="/payment-history" element={<PaymentHistory />} />
                <Route path="/payment-detail/:id" element={<PaymentDetail />} />
                <Route path="/expense" element={<ExpensePage />} />
                <Route path="/admin/billing" element={<ProtectedRoute><AdminBillingDashboard /></ProtectedRoute>} />
                <Route path="/resident/billing" element={<ProtectedRoute><ResidentBillingPage /></ProtectedRoute>} />
                
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/verify-otp/:userId" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:userId" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>}/>
                <Route path="/residentlist" element={<ResidentList/>}/>
                <Route path="/stafflist" element={<StaffList/>}/>
                <Route path="/users/:userId" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />

                
               

                <Route path="/viewParcels" element={<KsViewParcels />} />  
                <Route path="/addParcel" element={<KsAddParcel />} />       
                <Route path="/parcel/:id" element={<KsParcelDetail />} />
                <Route path="/scanner" element={<KsScanner />} />
                <Route path="/securityDashboard" element={<ProtectedRoute><KsSecurityDashboard /></ProtectedRoute>} />
                

               
                
            </Routes>


        </div>


       
        
    );
};

export default App;