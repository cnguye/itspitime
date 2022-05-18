import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/user_auth/Navbar";
import PiTimDashboard from "./components/user_auth/PiTimDashboard";

// Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
// override bootstrap css with custom app.css
import "./App.css";

function App() {
    const [name, setName] = useState('');
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Navbar name={name} />
                            <PiTimDashboard name={name} setName={setName} />
                        </>
                    } />
                </Routes>
            </BrowserRouter>
        </div >
    );
}

export default App;