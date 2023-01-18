const express = require ('express')
const bodyParser = require ('body-parser')
const apiRouter = require('./routes/api')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { User } = require('./db');
require('dotenv').config()
const app = express()

require('./db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
  origin: ["https://blog-app-gold-two.vercel.app/"],
  methods:["GET", "POST","UPDATE"],
  credentials:true
}));
app.use(cookieParser())


app.use('/api',apiRouter)

app.listen( ()=>{
  console.log('server started')
})