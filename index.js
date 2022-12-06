const express = require ('express')
const bodyParser = require ('body-parser')
const apiRouter = require('./routes/api')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require('express-session');

const app = express()

require('./db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
  origin: ["http://localhost:3000"],
  methods:["GET", "POST"],
  credentials:true
}));
app.use(cookieParser())

app.use(session({
  key:"userId",
  secret:"bruhmydbissecure",
  resave:false,
  saveUninitialized:false,
  cookie:{
    expires:60*60*24,
  }
}))

app.use('/api',apiRouter)

app.listen('3000', ()=>{
  console.log('app listening to 3000 B)')
})