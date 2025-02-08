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
const paymentRoutes = require("./routes/paymentRoutes");
//const routes = require('./routes/auth')
dotenv.config();
const app = express();
const allowedOrigins = [
  "https://www.managepro.net.in",
  "https://managepro.net.in", // Allow both www and non-www versions
];
// app.use(
//     cors({
//       origin: process.env.FRONTEND_URL,
//     })
// );
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required for authentication (cookies, tokens)
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
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})