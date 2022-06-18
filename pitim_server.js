const express = require("express");
const cors = require("cors");
const os = require("os");
const app = express();
const fetch = require('node-fetch');
app.use(cors());
require("dotenv").config({ path: os.homedir() + "/.env" });

const port = process.env.SITE_PORT || 5001;
const mysql = require("mysql");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This displays message that the server running and listening to specified port
app.listen(port, () => {
    console.log(`server running on port ${port} `);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", `${process.env.PITIM_URL}`);
    next();
});

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_MAIN,
});

// create a GET route
app.get("/express_backend", (req, res) => {
    res.set("Content-Type", "text/html");
    res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT FROM DB_API" });
});

app.get("/get_pi_skus", (req, res) => {
    const sqlSELECTALL = "SELECT * FROM pi_tim_models;";
    db.query(sqlSELECTALL, (err, results) => {
        res.status(200).send(results);
    });
});

app.get("/get_pi_currencies", (req, res) => {
    const sqlSELECTALL = "SELECT * FROM pi_tim_currencies;";
    db.query(sqlSELECTALL, (err, results) => {
        res.status(200).send(results);
    });
});

app.get("/get_user_settings", (req, res) => {
    const user_id = req.query.user_id;
    const sqlSELECTALL = "SELECT user_settings FROM pi_tim_user_settings WHERE user_id=?;";
    db.query(sqlSELECTALL, user_id, (err, results) => {
        res.status(200).send(results);
    });
});

app.post("/save_user_settings", (req, res) => {
    let date = new Date();
    const user_id = req.body.user_id;
    const user_name = req.body.user_name;
    const user_settings = JSON.stringify(req.body.user_settings);
    const sqlUPDATE =
        "INSERT INTO pi_tim_user_settings (user_id, user_name, user_settings, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_settings=?, updatedAt=?";
    db.query(
        sqlUPDATE,
        [user_id, user_name, user_settings, date, date, user_settings, date],
        (err, results) => {
            res.status(200).send(results);
        }
    );
});

app.post("/test_telegram_api_key", (req, res) => {
    const chatID = req.body.chatID;
    const botKey = req.body.botKey;
    const message = 'Greetings!\n This is a <b>test</b> from PiTim!\n\n The test is successful.';
    console.log(chatID, botKey);
    fetch(
        `https://api.telegram.org/bot${botKey}/sendMessage?chat_id=${chatID}&parse_mode=HTML&text=${message}`
    )
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            res.status(200).send(response);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
});
