const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { User } = require('../../db')

router.get('/', async (req, res) => {
	const users = await User.findAll();
  const usersResults = [];
  if (users !== null){
    users.forEach(usr => {
      usersResults.push({username:usr.username, userID:usr.id,role:usr.role})
    });
    return res.json(usersResults);
  }
	return res.send({error: 'No users on database'})
});

router.get('/getFollowers/:userId',async(req,res)=>{
  const user = await User.findOne({
    where:{id:req.params.userId},
    include:'followers'
  })
  if(user !== null){
    if (user.followers.length > 0){
      const followersArr = []
      user.followers.forEach(usr=>{followersArr.push({username:usr.username,id:usr.id})})  
      res.json({followers:followersArr,quantity:followersArr.length})
      return
    }else if (user.followers.length === 0){
      res.json({followers:'No followers',quantity:0})
      return
    }
  }
  res.send('UserNotFound')
})

router.get('/getFollowing/:userId',async(req,res)=>{
  const user = await User.findOne({
    where:{id:req.params.userId},
    include:'following'
  })
  if(user !== null){
    if (user.following.length > 0){
      const followingArr = []
      user.following.forEach(usr=>{followingArr.push({username:usr.username,id:usr.id})})  
      res.json({following:followingArr,quantity:followingArr.length})
      return
    }else if (user.following.length === 0){
      res.json({following:'No one follows you',quantity:0})
      return
    }
  }
  res.send('UserNotFound')
})

router.get('/lookfor/:userId', async (req, res) => {
	const user = await User.findByPk(req.params.userId);
  if(user !== null){
    const result = {username:user.username, userID:user.id}
    return res.json(result)
  }
  return res.send({ error: 'No user with that id' });
});

router.post('/register', [
	check('username', 'Username obligatory').not().isEmpty(),
	check('password', 'Password obligatory').not().isEmpty(),
	check('email', 'Email must be valid').isEmail()
], async (req, res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).json({ errores: errors.array() });	
	}
	req.body.password = bcrypt.hashSync(req.body.password, 10);
	const user = await User.create({
    username:req.body.username,
    role:"User",
    email:req.body.email,
    password:req.body.password,
    refreshToken:" " 
  });
	res.json(user);
});

router.post('/login', async (req, res) => {
	const user = await User.findOne({ where: { email: req.body.email }});
	if(user) {
		const passMatch = bcrypt.compareSync(req.body.password, user.password);
		if(passMatch) {     
      const accessToken = jwt.sign(     
        {"UserInfo":
          {"username":user.username,
            "id":user.id,
            "role":user.role,
          }
        },
        process.env.JWT_ACCESS_DATABASE_SECRET,
        {expiresIn:'300s'}
      );
      const refreshToken = jwt.sign(
        {"UserInfo":
          {
            "username":user.username,
            "id":user.id,
            "role":user.role,
          }
        },
        process.env.JWT_REFRESH_DATABASE_SECRET,
        {expiresIn:'1d'}
      );
      await User.update({refreshToken:refreshToken},{where:{id:user.id}})
      res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'none',secure:true,maxAge:24*60*60*1000});
      res.json({authorized:true,accessToken:accessToken,Role:user.role})
		} else {
			res.json({authorized:false, error: 'Error in user / password' });
		}
	} else {
		res.json({authorized:false, error: 'Error in user / password' });
	}
});

router.get('/refreshToken', async (req,res)=>{
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({where:{refreshToken:refreshToken}})
  if(!foundUser)return res.sendStatus(403);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_DATABASE_SECRET,
    (err,decoded)=>{
      if(err || (foundUser.username !== decoded.UserInfo.username))return res.sendStatus(403);
      const role = foundUser.role     
      const accessToken = jwt.sign(
        {"UserInfo":
          {
            "username":decoded.username,
            "id":decoded.id,
            "role":foundUser.role
          }
        },
        process.env.JWT_ACCESS_DATABASE_SECRET,
        {expiresIn:'300s'}
      );
      res.json({role,accessToken})
    }
  );
})

router.get('/logout',async(req,res)=>{
  //Remember to delete AccessToken in front-end
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(204)
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({where:{refreshToken:refreshToken}});
  if(!foundUser){
    res.clearCookie('jwt',{httpOnly:true,maxAge:24*60*60*1000});
    return res.sendStatus(204);
  }
  await User.update({refreshToken:' '},{where:{refreshToken:refreshToken}})
  res.clearCookie('jwt',{httpOnly:true,sameSite:'none',secure:true,maxAge:24*60*60*1000});
  res.send('Logout successful')
})


module.exports = router;