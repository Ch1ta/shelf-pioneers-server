require('dotenv').config();
const express = require('express');
const cors =  require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const errorMiddleware = require('./middleware/error-middleware')

const userRouter = require('./router/user-router')
const adminRouter = require('./router/admin-router')

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json()) //чтобы читать body реквеста
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(userRouter)
app.use(adminRouter)
app.use(errorMiddleware)

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(`MongoDB connection error: ${err}`))
app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Listening port ${PORT}`);
})


