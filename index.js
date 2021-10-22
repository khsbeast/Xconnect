const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')
const userRoute = require('./Routes/users')
const authRoute = require('./Routes/auth')
dotenv.config();

mongoose.connect(process.env.MONGO_URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true
  },() => {
    console.log("Database connected")
})
//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use('/api/user',userRoute)
app.use('/api/auth', authRoute)

app.listen(5000,() => {
    console.log("Backend server is running")
})