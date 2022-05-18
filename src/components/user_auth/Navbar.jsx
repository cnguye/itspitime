import React, { useState } from 'react';
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
    const { name } = props;

    const [isLoggingIn, setIsLogginIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();

    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5002/logout');
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
                setIsLogginIn(true);
                break;
            case 'register':
                setIsRegistering(true);
                break;
            default:
            // do nothing
        }
    };

    return (
        <Nav className="navbar__body" aria-label="main navigation" onSelect={navBarSelectHandler}>
            <Nav.Item className="navbar__item navbar__logo">
                <Nav.Link className="navbar-item" href="https:christopherhnguyen.com">
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
                            <Nav.Link eventKey="login">Login</Nav.Link>
                            {
                                isLoggingIn && <Login />
                            }
                        </Nav.Item>
                        <Nav.Item className="navbar__item">
                            <Nav.Link eventKey="register">Register</Nav.Link>
                            {
                                isRegistering && <Register />
                            }
                        </Nav.Item>


                    </Nav.Item>
            }
        </Nav >
    );
};

export default Navbar;