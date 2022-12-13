
const verifyRole = (allowedRole)=>{
   return (req,res,next)=>{
    if(!req?.role) return res.sendStatus(401);
    if(req.role !== allowedRole){
      return res.sendStatus(401);
    }
    next();
   }
}

module.exports=verifyRole;