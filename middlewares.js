const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
	const token = req.headers["x-access-token"]
  if(!token){
    res.json({authenticated:false,error:"No token in header"})
  }else{
    jwt.verify(token,process.env.JWT_DATABASE_SECRET,(err,decoded)=>{
      if(err){
        res.json({authenticated:false,error:"You failed to authenticate"})
      }else{
        req.userId = decoded.id;
        next()
      }
    })
  }
}

module.exports = {verifyJWT}