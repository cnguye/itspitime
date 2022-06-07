import React, { useState } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

// import bootstrap components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";


const Login = (props) => {
    const {
        setUserID,
        setToken,
        setExpire,
        setName,
        setIsLoggingIn,
    } = props;


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();

    const SERVER_URL =
        process.env.NODE_ENV !== "production"
            ? `http://localhost:5002`
            : "https://pitim.christopherhnguyen.com/pi_api";

    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${SERVER_URL}/login`, {
                email: email,
                password: password
            });
            setIsLoggingIn(false);
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setUserID(decoded.userId);
            setExpire(decoded.exp);
            setName(decoded.name);
            navigate("/");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const handleSubmit = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            Auth(e);
        }
        setValidated(true);
    };

    const closeLogin = (e) => {
        e.stopPropagation();
        setIsLoggingIn(false);
    }

    return (
        <div>
            <div onClick={closeLogin} className="card__background">
            </div>
            <Card onClick={(e) => e.stopPropagation()} className="userAuth__body">
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="userAuth__container">
                    <Form.Group className="mb-3" controlId="formBasic">
                        <Form.Label>Email</Form.Label>
                        <InputGroup hasValidation className="userAuth__inputgroup--validation">
                            <Form.Control
                                className="userAuth__formcontrol"
                                type="email"
                                placeholder="Email/Username"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Form.Text className="form-text-muted form__failure">
                                {msg.includes("Email") && msg}
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Email required.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <InputGroup hasValidation className="userAuth__inputgroup--validation">
                            <Form.Control
                                className="userAuth__formcontrol"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Form.Text className="form-text-muted form__failure">
                                {msg.includes("Password") && msg}
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Password required.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Login;