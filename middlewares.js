const jwt = require('jwt-simple')

const checkToken = (req, res, next) => {
	if(!req.headers['access-token'])	{
		res.json({ error: 'You need to include the access-token in the headers' })
	}
	const accessToken = req.headers['access-token']
	let payload = {}
	try {
		payload = jwt.decode(accessToken, 'secretPhrase')
	} catch(error) {
		return res.json({ error: 'Access-token is Incorrect' })
	}
	if(payload.expiresAt < moment().unix()) {
		return res.json({ error: 'Access-token has expired' })
	}
	req.usuarioId = payload.usuarioId
	next()
}

module.exports = {checkToken}