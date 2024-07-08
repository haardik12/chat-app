const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./config/connectDb');
const router = require('./routes')
const cookiesParser = require('cookie-parser');
const { app, server } = require('./socket/index')

// const app = express();
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))

app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
    res.json({
        message : 'server running on port' + PORT
    })
})

// api end points
app.use('/api', router)

connectDb().then(() => {
   server.listen(PORT, () => {
     console.log('server is runnung on port ' + PORT)
   }) 
})
