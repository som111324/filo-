
require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');

app.use(express.static('public'));
app.use(express.json());


const mongoose = require('mongoose');
const db = require("./config/db");


app.set('views',path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


app.use('/api/files', require('./Routes/files'));
app.use('/files', require('./Routes/show'))
app.use('/files/download',require('./Routes/download'))

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})