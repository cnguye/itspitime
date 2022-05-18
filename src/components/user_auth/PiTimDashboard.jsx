import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

// import pitim logo
import piTimLogo from '../../assets/pitim_target.png';

import PiList from "../PiList";
import PiForm from "../PiForm";

// import bootstrap components
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";


function PiTimDashboard(props) {

    const {
        name,
        setName,
        token,
        setToken,
        expire,
        setExpire
    } = props;

    const DISABLE_SAVE_OVERRIDE = name !== '' ? false : true;
    const URL_SITE =
        process.env.NODE_ENV !== "production"
            ? `http://localhost:5001`
            : "https://pitim.christopherhnguyen.com/pitim_api";

    const URL_SERVER =
        process.env.NODE_ENV !== "production"
            ? `http://localhost:5002`
            : "https://pitim.christopherhnguyen.com/db_api";

    // user settings
    const navigate = useNavigate();
    const [userID, setUserID] = useState();

    const [dbUserSettings, setDbUserSettings] = useState([]);
    const [currUserSettings, setCurrUserSettings] = useState([]);

    // get existing models and currencies from database
    const [dbUserWatchList, setDbUserWatchList] = useState([]);
    const [userWatchList, setUserWatchList] = useState([]);
    const [dbCurrenciesList, setDbCurrenciesList] = useState([]);
    const [currenciesList, setCurrenciesList] = useState([]);

    // app variables
    const [formSkuSelected, setFormSkuSelected] = useState("");
    const [formModelSelected, setFormModelSelected] = useState("");
    const [formCurrencySelected, setFormCurrencySelected] = useState("ALL");
    const [isListModified, setIsListModified] = useState(false);

    useEffect(() => {
        refreshToken();
        getPiSkuModels();
        get_pi_currencies();
        // eslint-disable-next-line
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get(`${URL_SERVER}/token`);
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setUserID(decoded.userId);
            getUserSettings();
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    };

    const getPiSkuModels = async () => {
        const response = await axios.get(`${URL_SERVER}/get_pi_skus`);
        let data = response.data;
        setUserWatchList(JSON.parse(JSON.stringify(data)));
        setDbUserWatchList(JSON.parse(JSON.stringify(data)));
        setFormSkuSelected(data[0].sku);
        setFormModelSelected(data[0].model);
    };

    const get_pi_currencies = async () => {
        const response = await axios.get(`${URL_SERVER}/get_pi_currencies`);
        let data = response.data;
        setDbCurrenciesList([{ currency: "ALL", id: 0 }, ...data]);
        setCurrenciesList([{ currency: "ALL", id: 0 }, ...data]);
    };

    const getUserSettings = async () => {
        const response = await axiosJWT.get(`${URL_SERVER}/get_user_settings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        let data = response.data;
        setDbUserSettings(JSON.parse(data[0].user_settings));
        setCurrUserSettings(JSON.parse(data[0].user_settings));
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(`${URL_SERVER}/token`);
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });



    // fetch latest models and currencies
    useEffect(() => {
        async function postData(url = "", data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }
                // body: JSON.stringify(data) // body data type must match "Content-Type" header 
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }
        postData(`${URL_SITE}/get_pi_skus`)
            .then((data) => {
                // setUserWatchList(JSON.parse(JSON.stringify(data)));
                // setDbUserWatchList(JSON.parse(JSON.stringify(data)));
                // setFormSkuSelected(data[0].sku);
                // setFormModelSelected(data[0].model);
            });

        // postData(`${URL_SITE}/get_pi_currencies`)
        //     .then((data) => {
        // setDbCurrenciesList([{ currency: "ALL", id: 0 }, ...data]);
        // setCurrenciesList([{ currency: "ALL", id: 0 }, ...data]);
        //     });
    }, [URL_SITE]);

    // fetch user settings
    useEffect(() => {
        async function postData(url = "", user_id = 0) {
            // Default options are marked with *
            const response = await fetch(`${url}/?user_id=${user_id}`, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }
                // body: JSON.stringify(data) // body data type must match "Content-Type" header 
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }
        postData(`${URL_SITE}/get_user_settings`, userID)
            .then((data) => {
                data = data[0] !== undefined ? JSON.parse(data[0].user_settings) : [];
                setDbUserSettings(data);
                setCurrUserSettings(data);
            });
    }, [URL_SITE, userID]);

    // save user settings
    const saveUserSettings = (e) => {
        e.preventDefault();
        async function saveUserSettings(url = "", data = {}) {
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
        saveUserSettings(`${URL_SITE}/save_user_settings`, { user_id: userID, user_name: name, user_settings: currUserSettings })
            .then((data) => {
                alert("Updated user successfully!");
            });
    };

    // update form list
    useEffect(() => {
        let temp_dbUserWatchList = JSON.parse(JSON.stringify(dbUserWatchList));
        setUserWatchList(temp_dbUserWatchList.map((model) => {
            currUserSettings.forEach(userRow => {
                if (userRow.sku === model.sku && (userRow.currencies.includes('ALL') || userRow.currencies.length === (dbCurrenciesList.length))) {
                    model.disabled = true;
                }
            });
            return model;
        }));
    }, [dbCurrenciesList.length, dbUserWatchList, currUserSettings]);

    // Set next available model as pre-selected model after user adds a model
    useEffect(() => {
        for (let i = 0; i < userWatchList.length; i++) {
            if (!userWatchList[i].disabled) {
                setFormSkuSelected(userWatchList[i].sku);
                setFormModelSelected(userWatchList[i].model);
                break;
            }
        }
    }, [userWatchList]);

    // Set next available currency as pre-selected model after user adds a model
    useEffect(() => {
        for (let i = 0; i < currenciesList.length; i++) {
            if (!currenciesList[i].disabled) {
                setFormCurrencySelected(currenciesList[i].currency);
                break;
            }
        }
    }, [currenciesList, userWatchList]);

    // filter form currencies for what is available to add to the watchlist
    useEffect(() => {
        let currUserSettingsSku = currUserSettings[currUserSettings.findIndex(row => row.sku === formSkuSelected)];
        let currentCurrencies = currUserSettingsSku !== undefined ? currUserSettingsSku.currencies : [];
        setCurrenciesList(dbCurrenciesList.map((currency) => {
            if (currentCurrencies.includes(currency.currency)) {
                return {
                    ...currency, disabled: true
                };
            }
            return currency;
        }));
    }, [currUserSettings, dbCurrenciesList, formSkuSelected]);

    const addPiToWatchList = (e) => {
        e.preventDefault();
        setIsListModified(true);
        if (!currUserSettings.filter((row) => {
            return row.sku === formSkuSelected;
        }).length > 0) {
            setCurrUserSettings([
                ...currUserSettings, {
                    sku: formSkuSelected,
                    model: formModelSelected,
                    currencies: [formCurrencySelected]
                }
            ]);
        } else {
            setCurrUserSettings(currUserSettings.map((row) => {
                if (row.sku === formSkuSelected) {
                    if (formCurrencySelected === "ALL")
                        return { ...row, currencies: ["ALL"] };
                    return { ...row, currencies: [...row.currencies, formCurrencySelected] };
                }
                return row;
            }));
        }
    };


    const formModelSelectedHandler = (e) => {
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index];
        const option =  el.getAttribute('id').split('form__option--')[1]; 
        setFormSkuSelected(option);
        setFormModelSelected(e.target.selectedOptions[0].text);
    };

    const formCurrencySelectedHandler = (e) => {
        setFormCurrencySelected(e.target.selectedOptions[0].text);
    };

    // reset user settings to current database user settings
    const resetUserSettings = (e) => {
        e.preventDefault();
        setCurrUserSettings(dbUserSettings);
        setUserWatchList(dbUserWatchList);
        setIsListModified(false);
    };

    return (
        <div className="pitim__body">
            <div className="project__header">
                <img className="project__logo" src={piTimLogo} alt="piTime_logo" />
                <h1 className="project__title">Pi Tim: rpilocator Telegram notifier</h1>
                <h3 className="project__description">
                    <i>
                        This app will tell a Telegram bot to send me a message every minute if
                        a Raspberry Pi is in stock
                    </i>
                </h3>
            </div>
            <PiForm
                addPiToWatchList={addPiToWatchList}
                userWatchList={userWatchList}
                currenciesList={currenciesList}
                setCurrenciesList={setCurrenciesList}
                formModelSelected={formModelSelected}
                formModelSelectedHandler={formModelSelectedHandler}
                formCurrencySelectedHandler={formCurrencySelectedHandler}
            />
            <PiList
                currUserSettings={currUserSettings}
                setCurrUserSettings={setCurrUserSettings}
                currenciesList={currenciesList}
                setIsListModified={setIsListModified}
                formModelSelectedHandler={formModelSelectedHandler}
                formCurrencySelectedHandler={formCurrencySelectedHandler}
                userWatchList={userWatchList}
                setUserWatchList={setUserWatchList}
            />
            <ButtonGroup className="project__footer">
                <Button onClick={saveUserSettings}
                    className="saveSettings__btn"
                    variant={`${isListModified ? 'success' : 'secondary'}`}
                    disabled={!isListModified || DISABLE_SAVE_OVERRIDE}
                    type="submit"
                >
                    Save Watchlist
                </Button>
                <Button onClick={resetUserSettings}
                    className="cancelSettings__btn"
                    variant={`${isListModified ? 'danger' : 'secondary'}`}
                    disabled={!isListModified}
                    type="submit"
                >
                    Reset Changes
                </Button>
            </ButtonGroup>
            {isListModified && DISABLE_SAVE_OVERRIDE &&
                <Card className="disable_save_override" border={"danger"} bg={"light"}>
                    <p>Sorry, saving has been disabled by the admin (me) as I figure out how to get user login to work. Feel free to mess around with the app!</p>
                    <p>You can find out more about me and my projects <a href="https://christopherhnguyen.com" target="_black">here</a>.</p>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Project timeline:</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup as="ol" numbered>
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start disable_save_override--list-group"
                                    >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">User login and authentication</div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start disable_save_override--list-group"
                                    >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">Blacklist sites</div>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card>
            }
        </div>
    );
}

export default PiTimDashboard;