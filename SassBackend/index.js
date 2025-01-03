const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const ConnectDB = require('./config/db');
//const routes = require('./routes/auth')
dotenv.config();
const app = express();
app.use(
    cors({
      origin: process.env.FRONTEND_URL,
    })
);
app.use(express.json());
ConnectDB();
app.use('/api',routes);
const PORT = process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})