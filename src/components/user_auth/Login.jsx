import React, { useState } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

// import bootstrap components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const Login = (props) => {
    const {
        setToken,
        setExpire,
        setName,
        setIsLogginIn
    } = props;


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5002/login', {
                email: email,
                password: password
            });
            setIsLogginIn(false);
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setExpire(decoded.exp);
            setName(decoded.name);
            navigate("/");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <Card className="userAuth__body">
            <Form onSubmit={Auth} className="userAuth__container">
                <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email/Username" onChange={(e) => setEmail(e.target.value)} />
                    <Form.Text className="text-muted form__failure">
                        {msg.includes("Email") && msg}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <Form.Text className="text-muted form__failure">
                        {msg.includes("Password") && msg}
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Card>
    );
};

export default Login;