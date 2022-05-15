// Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

// override bootstrap css with custom app.css
import "./App.css";

// import pitim logo
import piTimLogo from './assets/pitim_target.png';

import { useEffect, useState } from "react";

import PiList from "./components/PiList";
import PiForm from "./components/PiForm";

// import bootstrap components
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";

function App() {
    const URL =
        process.env.NODE_ENV !== "production"
            ? "http://localhost:5001"
            : "https://pitim.christopherhnguyen.com/db_api";
    // user settings
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

    const USER_ID = 1;

    const DISABLE_SAVE_OVERRIDE = true;
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
        postData(`${URL}/get_pi_skus`)
            .then((data) => {
                setUserWatchList(JSON.parse(JSON.stringify(data)));
                setDbUserWatchList(JSON.parse(JSON.stringify(data)));
                setFormSkuSelected(data[0].sku);
                setFormModelSelected(data[0].model);
            });

        postData(`${URL}/get_pi_currencies`)
            .then((data) => {
                setDbCurrenciesList([{ currency: "ALL", id: 0 }, ...data]);
                setCurrenciesList([{ currency: "ALL", id: 0 }, ...data]);
            });
    }, [URL]);

    // fetch user settings
    useEffect(() => {
        async function postData(url = "", user_id) {
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
        postData(`${URL}/get_user_settings`, USER_ID)
            .then((data) => {
                data = data[0] !== undefined ? JSON.parse(data[0].user_settings) : [];
                setDbUserSettings(data);
                setCurrUserSettings(data);
            });
    }, [URL]);

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
        saveUserSettings(`${URL}/save_user_settings`, { user_id: 1, user_settings: currUserSettings })
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
        setFormSkuSelected(e.target.value);
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
        <div className="App">
            <div className="project__header">
                <img className="project__logo" src={piTimLogo} alt="piTime_logo" />
                <h1 className="project__title">Pi Tim: rpilocator Telegram notifier</h1>
                <h3 className="project__description">
                    <i>
                        This scraper will tell a Telegram bot to send me a message every minute if
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
        </div >
    );
}

export default App;
