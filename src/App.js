import "./App.css";
// Bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";

import PiList from "./components/PiList";
import PiForm from "./components/PiForm";


function App() {
    const [formCurrencySelected, setFormCurrencySelected] = useState('All');
    const [formModelSelected, setFormModelSelected] = useState('All');

    useEffect(() => {
        return () => {
            console.log("Hi useEffect");
        };
    }, []);

    return (
        <div className="App">
            <h1 className="project__title">Pi Tim: rpilocator Telegram notifier</h1>
            <h3 className="project__description">
                <i>
                    This scraper will tell a Telegram bot to send you a message every 10 seconds if
                    a Raspberry Pi is in stock
                </i>
            </h3>
            <PiForm setFormCurrencySelected={setFormCurrencySelected} />
            <PiList />
        </div>
    );
}

export default App;
