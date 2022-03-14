const express = require('express');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const authRoute = require('./Routes/authRoutes');
const userRoute = require('./Routes/userRoute');

const { UI_ROOT_URI } = require('./config/config');

const app = express();

app.use(
  cors({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: UI_ROOT_URI,
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use('/', authRoute);
app.use('/', userRoute);

module.exports = app;
