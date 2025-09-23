import React from "react";
import {Route, Routes } from "react-router";
import GKViewServices from './pages/GKViewServices.jsx'
import GKUpdateService from './pages/GKUpdateService.jsx'
import GKDeleteService from './pages/GKDeleteService.jsx'
import GKRequestService from './pages/GKRequestService.jsx';
import GKAdminViewServices from './pages/GKAdminViewServices.jsx';

const App = () =>{
    return(
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKViewServices />} />
                <Route path="/update-service/:id" element={<GKUpdateService />} />
                <Route path="/delete-service/:id" element={<GKDeleteService />} />
                <Route path="/add-service" element={<GKRequestService />} />

               
                <Route path="/admin-view" element={<GKAdminViewServices />} />
            </Routes>


        </div>
        
    );
};

export default App;