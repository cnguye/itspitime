// Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

// override bootstrap css with custom app.css
import "./App.css";

import { useEffect, useState } from "react";

import PiList from "./components/PiList";
import PiForm from "./components/PiForm";

// import bootstrap components
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"

function App() {
    const URL =
        process.env.NODE_ENV !== "production"
            ? "http://localhost:5001"
            : "https://pitim.christopherhnguyen.com/api";

    // user settings
    const [dbUserSettings, setDbUserSettings] = useState([]);
    const [currUserSettings, setCurrUserSettings] = useState([]);

    const [dbModelsList, setDbModelsList] = useState([]);
    const [modelsList, setModelsList] = useState([]);
    const [dbCurrenciesList, setDbCurrenciesList] = useState([]);
    const [currenciesList, setCurrenciesList] = useState([]);

    const [formSkuSelected, setFormSkuSelected] = useState("");
    const [formModelSelected, setFormModelSelected] = useState("");
    const [formCurrencySelected, setFormCurrencySelected] = useState("ALL");

    const [isListModified, setIsListModified] = useState(false);
    const [watchListRefreshTimeLeft, setWatchListRefreshTimeLeft] = useState(0);

    const USER_ID = 1;

    // fetch latest models and currencies
    useEffect(() => {
        return () => {
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
                    setModelsList(JSON.parse(JSON.stringify(data)));
                    setDbModelsList(JSON.parse(JSON.stringify(data)));
                    setFormSkuSelected(data[0].sku)
                    setFormModelSelected(data[0].model)
                });

            postData(`${URL}/get_pi_currencies`)
                .then((data) => {
                    setDbCurrenciesList(data);
                    setCurrenciesList(data);
                });
        };
    }, [URL, dbUserSettings]);

    useEffect( () => {
        console.log("Hello dbModelsList");
    }, [dbModelsList])

    // fetch user settings
    useEffect(() => {
        return () => {
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
            postData(`${URL}/get_user_settings`, { user_id: USER_ID })
                .then((data) => {
                    setDbUserSettings(data);
                    setCurrUserSettings(data);
                });
        };
    }, [URL]);

    // update form list
    useEffect(() => {
        setModelsList(modelsList => modelsList.map((model) => {
            currUserSettings.forEach(userRow => {
                if (userRow.sku === model.sku && userRow.currency === 'ALL') {
                    model.disabled = true;
                }
            })
            return model;
        }))

    }, [currUserSettings])

    useEffect(() => {
        for (let i = 0; i < modelsList.length; i++) {
            if (!modelsList[i].disabled) {
                setFormSkuSelected(modelsList[i].sku);
                setFormModelSelected(modelsList[i].model);
                break;
            }
        }
    }, [modelsList])

    const addPiToWatchList = (e) => {
        e.preventDefault();
        setIsListModified(true);
        setCurrUserSettings([
            ...currUserSettings, {
                sku: formSkuSelected,
                model: formModelSelected,
                currency: formCurrencySelected
            }
        ])
    };

    const refreshWatchList = (e) => {
        e.preventDefault();
        // can only refresh every 15 seconds
        let seconds = 15;
        setWatchListRefreshTimeLeft(seconds);
        let timer = setInterval(() => {
            seconds--;
            setWatchListRefreshTimeLeft(seconds);
            if (seconds === 0) {
                clearInterval(timer);
            }
        }, 1000)
    }

    const saveUserSettings = (e) => {
        e.preventDefault();
        console.log("hello");
        // async function addPiToWatchlist(url = "", data = {}) {
        //     // Default options are marked with *
        //     const response = await fetch(url, {
        //         method: "POST", // *GET, POST, PUT, DELETE, etc.
        //         headers: {
        //             "Content-Type": "application/json",
        //             Accept: "application/json",
        //             // 'Content-Type': 'application/x-www-form-urlencoded',
        //         },
        //         body: JSON.stringify(data), // body data type must match "Content-Type" header
        //     });
        //     return response.json(); // parses JSON response into native JavaScript objects
        // }
        // addPiToWatchlist(`${URL}/add_pi`, { user_id: 1, user_settings: setCurrUserSettings })
        //     .then((data) => {
        //         alert("Updated user successfully!")
        //     });
    }

    const cancelUserSettings = (e) => {
        console.log("Hello cancelUserSettings");
        e.preventDefault();
        setCurrUserSettings(dbUserSettings);
        setModelsList(dbModelsList);
    }

    return (
        <div className="App">
            <h1 className="project__title">Pi Tim: rpilocator Telegram notifier</h1>
            <h3 className="project__description">
                <i>
                    This scraper will tell a Telegram bot to send you a message every minute if
                    a Raspberry Pi is in stock
                </i>
            </h3>
            <PiForm
                setFormSkuSelected={setFormSkuSelected}
                setFormModelSelected={setFormModelSelected}
                setFormCurrencySelected={setFormCurrencySelected}
                addPiToWatchList={addPiToWatchList}
                modelsList={modelsList}
                currenciesList={currenciesList}
                formSkuSelected={formSkuSelected}
            />
            <PiList
                currUserSettings={currUserSettings}
                watchListRefreshTimeLeft={watchListRefreshTimeLeft}
                refreshWatchList={refreshWatchList}
            />
            <ButtonGroup className="project__footer">
                <Button onClick={saveUserSettings}
                    className="saveSettings__btn"
                    variant={`${isListModified ? 'success' : 'secondary'}`}
                    disabled={!isListModified}
                    type="submit"
                >
                    Save Watchlist
                </Button>
                <Button onClick={cancelUserSettings}
                    className="cancelSettings__btn"
                    variant={`${isListModified ? 'danger' : 'secondary'}`}
                    disabled={!isListModified}
                    type="submit"
                >
                    Reset Changes
                </Button>
            </ButtonGroup>
        </div >
    );
}

export default App;
