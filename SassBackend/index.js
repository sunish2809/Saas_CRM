const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const ConnectDB = require('./config/db');
const  authroutes = require( './routes/auth');
const  libraryroutes = require( './routes/libraryRoutes');
const  gymroutes = require('./routes/gymRoutes');
const  flatroutes = require('./routes/flatRoutes');
const  ownerRoutes =require('./routes/ownerRoutes');
const messageRoutes = require('./routes/messageRoutes')
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
app.use('/api/auth',authroutes);
app.use('/api/library',libraryroutes);
app.use('/api/gym',gymroutes);
app.use('/api/flat',flatroutes);
app.use('/api/owner',ownerRoutes);
app.use('/api',messageRoutes);
const PORT = process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})