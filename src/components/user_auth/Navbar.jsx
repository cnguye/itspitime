import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// import components
import Login from "./Login";
import Register from "./Register";

// import christopherhnguyen logo
import ceenLogo from '../../assets/ceen_logo.png';

// import bootstrap components
import Nav from "react-bootstrap/Nav";
import NavDropdown from 'react-bootstrap/NavDropdown';

const Navbar = (props) => {
    const {
        setUserID,
        name,
        setName,
        isLoggingIn,
        setIsLoggingIn,
        isRegistering,
        setIsRegistering,
        setToken,
        setExpire,
    } = props;

    const SERVER_URL =
        process.env.NODE_ENV !== "production"
            ? `http://localhost:5002`
            : "https://pitim.christopherhnguyen.com/pi_api";


    const navigate = useNavigate();

    const Logout = async () => {
        try {
            await axios.delete(`${SERVER_URL}/logout`);
            setToken('');
            setName('');
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const navBarSelectHandler = (eventKey) => {
        switch (eventKey) {
            case 'logout':
                Logout();
                break;
            case 'login':
                setIsLoggingIn(true);
                setIsRegistering(false);
                break;
            case 'register':
                setIsRegistering(true);
                setIsLoggingIn(false);
                break;
            default:
            // do nothing
        }
    };

   
    return (
        <Nav className="navbar__body" aria-label="main navigation" onSelect={navBarSelectHandler}>
            <Nav.Item className="navbar__item navbar__logo">
                <Nav.Link className="navbar-item" rel="noreferrer" target="_blank" href="https://christopherhnguyen.com">
                    <img className="navbar-item__logo" src={ceenLogo} alt="logo" />
                </Nav.Link>
            </Nav.Item>
            {
                name !== '' ?
                    <Nav.Item className="navbar__item--menu">
                        <Nav.Item className="navbar__item navbar__welcome" disabled>
                            <Nav.Link>Welcome!</Nav.Link>
                        </Nav.Item>
                        <NavDropdown className="navbar__item navbar__dropdown" title={name}>
                            <NavDropdown.Item eventKey="logout">Logout</NavDropdown.Item>
                        </NavDropdown >
                    </Nav.Item>
                    :
                    <Nav.Item className="navbar__item--menu">
                        <Nav.Item className="navbar__item">
                            <Nav.Link eventKey="login" >Login</Nav.Link>
                            {
                                isLoggingIn &&
                                <Login
                                    setUserID={setUserID}
                                    setName={setName}
                                    isLoggingIn={isLoggingIn}
                                    setIsLoggingIn={setIsLoggingIn}
                                    setToken={setToken}
                                    setExpire={setExpire}
                                    getUserSettings
                                />
                            }
                        </Nav.Item>
                        <Nav.Item className="navbar__item">
                            <Nav.Link eventKey="register">Register</Nav.Link>
                            {
                                isRegistering &&
                                <Register
                                    setIsRegistering={setIsRegistering}
                                    setIsLoggingIn={setIsLoggingIn}
                                />
                            }
                        </Nav.Item>


                    </Nav.Item>
            }
        </Nav >
    );
};

export default Navbar;;