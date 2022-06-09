import React, { useState, useEffect } from 'react';
// import axios from 'axios';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function TelegramForm(props) {
    const { isLoggedIn, SITE_URL } = props;

    const [telegramChatID, setTelegramChatID] = useState('');
    const [telegramBotKey, setTelegramBotKey] = useState('');
    const [isTestPassed, setIsTestPassed] = useState(false);
    const [apiErrorLog, setApiErrorLog] = useState('');

    useEffect(() => {
     
    }, [isLoggedIn])
    

    const testAPIKeyHandler = async (e) => {
        e.preventDefault();
        async function testTelegramAPIKey(url = "", data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }
        testTelegramAPIKey(`${SITE_URL}/test_telegram_api_key`, {
            chatID: telegramChatID,
            botKey: telegramBotKey
        }).then((data) => {
            try {
                const error_code = data.error_code;
                const message = data.description;
                if(error_code === 401){
                    setApiErrorLog(`${error_code}: ${message}`);
                    setIsTestPassed(false);
                }
                else {
                    setIsTestPassed(true);
                    setApiErrorLog('');
                }
            }
            catch (error) {
                setApiErrorLog(error);
            }
        });
    };

    const addAPIKeyHandler = (e) => {
        e.preventDefault();
    };

    // 'https://api.telegram.org/bot{}/sendMessage?chat_id={}&parse_mode=HTML&text={}
    return (
        <Accordion
            defaultActiveKey="0"
            className="pi__section pi__section--accordian"
        >
            <Accordion.Item eventKey="0">
                <Accordion.Header className="">Telegram bot API</Accordion.Header>
                <Accordion.Body>

                    <Form
                        onSubmit={(e) => e.preventDefault()}
                        className="pi__form card__body--item"
                    >
                        <InputGroup className="telegram__input-group telegram__input-group--chat-id">
                            <Form.Label className="form__label">Chat ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Chat ID"
                                className="telegram__input telegram__input--chat-id"
                                onChange={(e) => setTelegramChatID(e.target.value)}
                                value={telegramChatID}
                                required
                            // onKeyDown={}
                            />
                        </InputGroup>
                        <InputGroup className="telegram__input-group telegram__input-group--api-key">
                            <Form.Label className="form__label">Bot Key</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="BOT API key"
                                className="telegram__input telegram__input--api-key"
                                onChange={(e) => setTelegramBotKey(e.target.value)}
                                value={telegramBotKey}
                                required
                            // onKeyDown={}
                            />
                        </InputGroup>
                        {isTestPassed &&
                            <FontAwesomeIcon
                                className="text-success text-success--api"
                                icon={faCircleCheck}
                            >
                            </FontAwesomeIcon>
                        }
                        <Button
                            onClick={testAPIKeyHandler}
                            className="pi__form--button"
                            variant="warning"
                            type="submit"
                        >
                            Test
                        </Button>
                        <Button
                            onClick={addAPIKeyHandler}
                            className="pi__form--button"
                            variant="success"
                            disabled={!isTestPassed}
                        >
                            Add
                        </Button>
                    </Form>
                    {(!isTestPassed && apiErrorLog) &&
                        <Form>
                            <InputGroup className="telegram__input-group telegram__input-group--chat-id">
                                <InputGroup.Text className="text-danger">ERROR</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    className=""
                                    value={apiErrorLog}
                                    disabled
                                // onKeyDown={}
                                />
                            </InputGroup>
                        </Form>
                    }
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default TelegramForm;