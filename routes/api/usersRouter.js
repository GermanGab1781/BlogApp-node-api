const router = require('express').Router();
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config()
const {verifyJWT} = require('../../middlewares')
const { User } = require('../../db')

router.get('/', async (req, res) => {
	const users = await User.findAll();
  const usersResults = [];
  if (users !== null){
    users.forEach(usr => {
      usersResults.push({username:usr.username, userID:usr.id})
    });
    return res.json(usersResults);
  }
	return res.send({error: 'No users on database'})
});

router.get('/:userId', async (req, res) => {
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
	const user = await User.create(req.body);
	res.json(user);
});

router.post('/login', async (req, res) => {
	const user = await User.findOne({ where: { email: req.body.email }});
	if(user) {
		const passMatch = bcrypt.compareSync(req.body.password, user.password);
		if(passMatch) {     
      const id = user.id;
      const token = jwt.sign({id},process.env.JWT_DATABASE_SECRET,{
        expiresIn:150,       
      })
      req.session.user = user;
			res.json({authorized:true, token:token,userId:user.id,username:user.username});
		} else {
			res.json({authorized:false, error: 'Error in user / password' });
		}
	} else {
		res.json({authorized:false, error: 'Error in user / password' });
	}
});

router.get('/loginCheck',verifyJWT, (req,res)=>{
  res.json({authenticated:true})
})



module.exports = router;