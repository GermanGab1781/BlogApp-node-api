const router = require('express').Router();
const moment = require('moment');
const jwt = require('jwt-simple');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

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
      req.session.user = user;
      console.log(req.session.user)
			res.json({ success: createToken(user), username:user.username, userID:user.id, email:user.email});
		} else {
			res.json({ error: 'Error in user / password' });
		}
	} else {
		res.json({ error: 'Error in user / password' });
	}
});

router.get('/loginCheck', (req,res)=>{
  if(req.session.user){
    res.send({loggedIn:true,user:req.session.user})
  }else{
    res.send({loggedIn:false})
  }
})

const createToken = (user) => {
	const payload = {
		usuarioId: user.id,
		createdAt: moment().unix(),
		expiresAt: moment().add(15, 'minutes').unix()
	};
	return jwt.encode(payload, 'SecretPhrase');
};

module.exports = router;