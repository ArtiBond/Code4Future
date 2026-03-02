const ss = require('node:dns/promises')
ss.setServers(["1.1.1.1", "8.8.8.8"]);
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const path = require('path');
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.static(path.join(__dirname, '../src')));
app.use('', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`Server started = http://localhost:${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()