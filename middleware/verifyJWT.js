const jwt = require('jsonwebtoken');
require('dotenv').config()

const verifyJWT = (req,res,next)=>{
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token=authHeader.split(' ')[1]   
  jwt.verify(
    token,
    process.env.JWT_ACCESS_DATABASE_SECRET,
    (err,decoded)=>{
      if(err)return res.sendStatus(403);//invalid Token
      req.user = decoded.UserInfo.username;
      req.role = decoded.UserInfo.role;
      next();
    }
  );
}

module.exports = verifyJWT