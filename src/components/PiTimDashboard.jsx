import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

// import pitim logo
import piTimLogo from '../assets/pitim_target.png';

import PiList from "./PiList/PiList";
import PiBlacklist from "./PiBlacklist/PiBlacklist";
import PiForm from "./PiForm/PiForm";

// import bootstrap components
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";

function PiTimDashboard(props) {

    const {
        userID,
        setUserID,
        name,
        setName,
        token,
        setToken,
        expire,
        setExpire
    } = props;

    const DISABLE_SAVE_OVERRIDE = name !== '' ? false : true;

    const SITE_URL =
        process.env.NODE_ENV !== "production"
            ? `http://localhost:5001`
            : "https://pitim.christopherhnguyen.com/db_api";

    const SERVER_URL =
        process.env.NODE_ENV !== "production"
            ? `http://localhost:5002`
            : "https://pitim.christopherhnguyen.com/pi_api";

    // user settings
    const navigate = useNavigate();

    const [dbUserSettings, setDbUserSettings] = useState({
        blacklist: [],
        watchlist: []
    });
    const [currUserSettings, setCurrUserSettings] = useState({
        blacklist: [],
        watchlist: []
    });

    // get existing models and currencies from database
    const [dbuserWatchlist, setDbuserWatchlist] = useState([]);
    const [userWatchlist, setUserWatchlist] = useState([]);
    const [dbCurrenciesList, setDbCurrenciesList] = useState([]);
    const [currenciesList, setCurrenciesList] = useState([]);

    // app variables
    const [formSkuSelected, setFormSkuSelected] = useState("");
    const [formModelSelected, setFormModelSelected] = useState("");
    const [formCurrencySelected, setFormCurrencySelected] = useState("ALL");
    const [isListModified, setIsListModified] = useState(false);
    const [currBlacklist, setCurrBlacklist] = useState([]);

    useEffect(() => {
        getPiSkuModels();
        get_pi_currencies();
        refreshToken();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (name !== '' && userID !== false)
            getUserSettings();
        else {
            setDbUserSettings({
                blacklist: [],
                watchlist: []
            });
            setCurrUserSettings({
                blacklist: [],
                watchlist: []
            });
            setCurrBlacklist([]);
        }
        // eslint-disable-next-line
    }, [name]);

    const refreshToken = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/token`);
            if (response.data.refreshToken) {
                setToken(response.data.accessToken);
                const decoded = jwt_decode(response.data.accessToken);
                setUserID(decoded.userId);
                setName(decoded.name);
                setExpire(decoded.exp);
                setUserID(decoded.userId);
                getUserSettings();
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/");
            }
        }
    };

    // fetch latest models and currencies
    const getPiSkuModels = async () => {
        const response = await axios.get(`${SERVER_URL}/get_pi_skus`);
        let data = response.data;
        setUserWatchlist(JSON.parse(JSON.stringify(data)));
        setDbuserWatchlist(JSON.parse(JSON.stringify(data)));
        setFormSkuSelected(data[0].sku);
        setFormModelSelected(data[0].model);
    };

    const get_pi_currencies = async () => {
        const response = await axios.get(`${SERVER_URL}/get_pi_currencies`);
        let data = response.data;
        setDbCurrenciesList([{ currency: "ALL", id: 0 }, ...data]);
        setCurrenciesList([{ currency: "ALL", id: 0 }, ...data]);
    };

    const getUserSettings = async () => {
        const response = await axios.get(`${SERVER_URL}/get_user_settings`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                user_id: userID
            }
        });
        let data = response.data;
        if (data[0] != null) {
            setDbUserSettings(JSON.parse(data[0].user_settings));
            setCurrUserSettings(JSON.parse(data[0].user_settings));
            setCurrBlacklist(JSON.parse(data[0].user_settings).blacklist);
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(`${SERVER_URL}/token`);
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
        saveUserSettings(`${SITE_URL}/save_user_settings`, { 
            user_id: userID, 
            user_name: name, 
            user_settings: { 
                blacklist: currBlacklist, 
                watchlist: currUserSettings.watchlist 
            }
        }).then((data) => {
                alert("Updated user successfully!");
            });
    };

    // update form list
    useEffect(() => {
        let temp_dbuserWatchlist = JSON.parse(JSON.stringify(dbuserWatchlist));
        setUserWatchlist(temp_dbuserWatchlist.map((model) => {
            currUserSettings.watchlist.forEach(userRow => {
                if (userRow.sku === model.sku && (userRow.currencies.includes('ALL') || userRow.currencies.length === (dbCurrenciesList.length))) {
                    model.disabled = true;
                }
            });
            return model;
        }));
    }, [dbCurrenciesList.length, dbuserWatchlist, currUserSettings]);

    // Set next available model as pre-selected model after user adds a model
    // only changes to first available model if pre-selected model runs out of currencies to watch
    useEffect(() => {
        let selectFirstModel = true;
        for (let i = 0; i < userWatchlist.length; i++) {
            if (userWatchlist[i].sku === formSkuSelected && !userWatchlist[i].disabled)
                selectFirstModel = false;
        }
        if (selectFirstModel) {
            for (let i = 0; i < userWatchlist.length; i++) {
                if (!userWatchlist[i].disabled) {
                    setFormSkuSelected(userWatchlist[i].sku);
                    setFormModelSelected(userWatchlist[i].model);
                    break;
                }
            }
        }
        // eslint-disable-next-line
    }, [userWatchlist]);

    // Set next available currency as pre-selected model after user adds a model
    useEffect(() => {
        for (let i = 0; i < currenciesList.length; i++) {
            if (!currenciesList[i].disabled) {
                setFormCurrencySelected(currenciesList[i].currency);
                break;
            }
        }
    }, [currenciesList, userWatchlist]);

    // filter form currencies for what is available to add to the watchlist
    useEffect(() => {
        let currUserSettingsSku = currUserSettings.watchlist[currUserSettings.watchlist.findIndex(row => row.sku === formSkuSelected)];
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

    const addPiToWatchlist = (e) => {
        e.preventDefault();
        setIsListModified(true);
        if (!currUserSettings.watchlist.filter((row) => {
            return row.sku === formSkuSelected;
        }).length > 0) {
            setCurrUserSettings({
                blacklist: currUserSettings.blacklist,
                watchlist: [
                    ...currUserSettings.watchlist, {
                        sku: formSkuSelected,
                        model: formModelSelected,
                        currencies: [formCurrencySelected]
                    }
                ]
            });
        } else {
            setCurrUserSettings({
                blacklist: currUserSettings.blacklist,
                watchlist: currUserSettings.watchlist.map((row) => {
                    if (row.sku === formSkuSelected) {
                        if (formCurrencySelected === "ALL")
                            return { ...row, currencies: ["ALL"] };
                        return { ...row, currencies: [...row.currencies, formCurrencySelected] };
                    }
                    return row;
                })
            });
        }
    };

    const formModelSelectedHandler = (e) => {
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index];
        const option = el.getAttribute('id').split('form__option--')[1];
        setFormSkuSelected(option);
        setFormModelSelected(e.target.selectedOptions[0].text);
    };

    const formCurrencySelectedHandler = (e) => {
        setFormCurrencySelected(e.target.selectedOptions[0].text);
    };

    // reset user settings to current database user settings
    const resetUserSettings = (e) => {
        e.preventDefault();
        // setCurrBlacklist(dbUserSettings.blacklist);
        setCurrUserSettings(dbUserSettings);
        setUserWatchlist(dbuserWatchlist);
        setCurrBlacklist(dbUserSettings.blacklist);
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
                addPiToWatchlist={addPiToWatchlist}
                userWatchlist={userWatchlist}
                currenciesList={currenciesList}
                setCurrenciesList={setCurrenciesList}
                formModelSelected={formModelSelected}
                formModelSelectedHandler={formModelSelectedHandler}
                formCurrencySelected={formCurrencySelected}
                formCurrencySelectedHandler={formCurrencySelectedHandler}
            />
            <PiBlacklist
                currBlacklist={currBlacklist}
                setCurrBlacklist={setCurrBlacklist}
                setIsListModified={setIsListModified}
            />
            <PiList
                currUserSettings={currUserSettings}
                setCurrUserSettings={setCurrUserSettings}
                currenciesList={currenciesList}
                setIsListModified={setIsListModified}
                formModelSelectedHandler={formModelSelectedHandler}
                formCurrencySelectedHandler={formCurrencySelectedHandler}
                userWatchlist={userWatchlist}
                setUserWatchlist={setUserWatchlist}
            />
            <ButtonGroup className="project__footer">
                <Button onClick={saveUserSettings}
                    className="saveSettings__btn"
                    variant={`${isListModified ? 'success' : 'secondary'}`}
                    disabled={!isListModified || DISABLE_SAVE_OVERRIDE}
                    type="submit"
                >
                    Save watchlist
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
                    <p>Sorry, saving has been disabled for unregistered users. Feel free to mess around with the app!</p>
                    <p>Registering has also been disabled.</p>
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
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start disable_save_override--list-group"
                                    >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">Optimization with advanced React Hooks</div>
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