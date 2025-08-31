import toast from "react-hot-toast";
import React from "react";
import {Route, Routes } from "react-router";
import GKServiceRequest from './pages/GKServiceRequest.jsx'
import Checkout from "./components/Checkout.jsx";

const App = () =>{
    return(
        <div className="p-4">
            <Routes>
                <Route path="/" element={<GKServiceRequest />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>

        </div>
        
    );
};

export default App;