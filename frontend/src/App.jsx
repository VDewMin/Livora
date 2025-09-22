import toast from "react-hot-toast";
import React from "react";
import {Route, Routes } from "react-router";
import GKServiceRequest from './pages/GKServiceRequest.jsx'
import KsViewParcels from "./pages/KsViewParcels.jsx"
import KsAddParcel from "./pages/KsAddParcel.jsx";
import KsParcelDetail from "./pages/KsParcelDetail.jsx"
import SecurityDashboard from "./pages/SecurityDashboard.jsx";


const App = () =>{
    return(
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKServiceRequest />} />

                <Route path="/viewParcels" element={<KsViewParcels />} />  
                <Route path="/addParcel" element={<KsAddParcel />} />       
                <Route path="/parcel/:id" element={<KsParcelDetail />} />
                <Route path="/security-dashboard" element={<SecurityDashboard />} />
            </Routes>

        </div>
    );
};

export default App;