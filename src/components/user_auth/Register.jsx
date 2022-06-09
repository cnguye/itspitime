import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

// import bootstrap components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const Register = (props) => {
    const {
        setIsRegistering,
        setIsLoggingIn
    } = props;

    const SERVER_URL =
        process.env.NODE_ENV !== "production"
            ? `http://localhost:5002`
            : "https://pitim.christopherhnguyen.com/pi_api";

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    // google recaptcha variables
    const [isReCaptchaApproved, setIsReCaptchaApproved] = useState(false);
    const gReCaptchaKey = "6LduKUggAAAAAONEF-Tu9nQohGla1rseszLpsAbE";

    // disable registering
    const [showDisabled, setShowDisabled] = useState(false);
    const DISABLE_REGISTER_OVERRIDE = true;

    const Register = async (e) => {
        e.preventDefault();
        if (!DISABLE_REGISTER_OVERRIDE) {
            try {
                await axios.post(`${SERVER_URL}/register`, {
                    name: name,
                    email: email,
                    password: password,
                    confPassword: confPassword
                });
                setIsRegistering(false);
                setIsLoggingIn(true);
                navigate("/", { replace: true });
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }
        else {
            setShowDisabled(true);
        }
    };

    const confirmRecaptcha = async () => {
        setIsReCaptchaApproved(true);
    };

    const closeRegister = () => {
        setIsRegistering(false);
    };

    return (
        <div>
            <div onClick={closeRegister} className="card__background">
            </div>
            <Card onClick={(e) => e.stopPropagation()} className="userAuth__body">
                <Form onSubmit={Register} className="userAuth__container">
                    <p className="has-text-centered">{msg}</p>
                    <Form.Group className="mb-3" controlId="regUserPiTim">
                        <Form.Label>Username</Form.Label>
                        <InputGroup hasValidation className="userAuth__inputgroup--validation">
                            <Form.Control
                                className="userAuth__formcontrol"
                                type="text"
                                placeholder="Username"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Username required.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Label>Email</Form.Label>
                        <InputGroup hasValidation className="userAuth__inputgroup--validation">
                            <Form.Control
                                className="userAuth__formcontrol"
                                type="email"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                Email required.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Label>Password</Form.Label>
                        <InputGroup hasValidation className="userAuth__inputgroup--validation">
                            <Form.Control
                                className="userAuth__formcontrol"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Password required.
                            </Form.Control.Feedback>
                        </InputGroup>

                        <Form.Label>Confirm password</Form.Label>
                        <InputGroup hasValidation className="userAuth__inputgroup--validation">
                            <Form.Control
                                className="userAuth__formcontrol"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setConfPassword(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Password required.
                            </Form.Control.Feedback>
                        </InputGroup>
                        <ReCAPTCHA
                            className="userAuth__gReCaptcha"
                            sitekey={gReCaptchaKey}
                            onChange={confirmRecaptcha}
                        />
                    </Form.Group>

                    <Button disabled={showDisabled && !isReCaptchaApproved} variant="primary" type="submit">
                        Register
                    </Button>
                    {showDisabled && <div className="userAuth__registerDisabled">Registering disabled</div>}
                </Form>
            </Card>
        </div>


    );
};

export default Register;