const express = require ('express')
const bodyParser = require ('body-parser')
const apiRouter = require('./routes/api')
const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3030;
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

app.listen(PORT,()=>{
  console.log('server started')
})