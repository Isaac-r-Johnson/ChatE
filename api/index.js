require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express()
app.use(bodyParser.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: '*'
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.listen(process.env.PORT, () => {
    console.log("Chaty server is running on port " + process.env.PORT + "...");
})

