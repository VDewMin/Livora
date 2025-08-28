import toast from "react-hot-toast";
import React from "react";
import {Route, Routes } from "react-router";
import GKServiceRequest from './pages/GKServiceRequest.jsx'

const App = () =>{
    return(
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKServiceRequest />} />
            </Routes>

        </div>
    );
};

export default App;