const router = require('express').Router();
const moment = require('moment');
const jwt = require('jwt-simple');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const { User } = require('../../db')

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
			res.json({ success: createToken(user), username:user.username, userID:user.id, email:user.email});
		} else {
			res.json({ error: 'Error in user / password' });
		}
	} else {
		res.json({ error: 'Error in user / password' });
	}
});

const createToken = (user) => {
	const payload = {
		usuarioId: user.id,
		createdAt: moment().unix(),
		expiresAt: moment().add(5, 'minutes').unix()
	};
	return jwt.encode(payload, 'SecretPhrase');
};

module.exports = router;