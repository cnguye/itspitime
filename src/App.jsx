import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/user_auth/Navbar";
import PiTimDashboard from "./components/user_auth/PiTimDashboard";

// Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
// override bootstrap css with custom app.css
import "./App.css";

function App() {
    const [userID, setUserID] = useState();
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [isLoggingIn, setIsLogginIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);


    const stopProps = (e) => {
        setIsLogginIn(false);
        setIsRegistering(false);
    };

    return (
        <div className="App" onClick={(e) => stopProps(e)}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Navbar
                                setUserID={setUserID}
                                name={name}
                                setName={setName}
                                token={token}
                                setToken={setToken}
                                setExpire={setExpire}
                                isLoggingIn={isLoggingIn}
                                setIsLogginIn={setIsLogginIn}
                                isRegistering={isRegistering}
                                setIsRegistering={setIsRegistering} />
                            <PiTimDashboard
                                userID={userID}
                                setUserID={setUserID}
                                name={name}
                                setName={setName}
                                token={token}
                                setToken={setToken}
                                expire={expire}
                                setExpire={setExpire} />
                        </>
                    } />
                </Routes>
            </BrowserRouter>
        </div >
    );
}

export default App;