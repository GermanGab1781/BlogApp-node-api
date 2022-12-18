const express = require ('express')
const bodyParser = require ('body-parser')
const apiRouter = require('./routes/api')
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config()
const app = express()

require('./db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
  origin: ["http://localhost:3000"],
  methods:["GET", "POST","UPDATE"],
  credentials:true
}));
app.use(cookieParser())


app.use('/api',apiRouter)

app.listen('3001', ()=>{
  console.log('app listening to 3001 B)')
})