const router = require('express').Router()

const apiUsersRouter = require('./api/usersRouter')
const apiBooksRouter = require('./api/booksRouter')
const verifyJWT = require('../middleware/verifyJWT')

router.use('/users',apiUsersRouter)
router.use('/books',verifyJWT,apiBooksRouter)

module.exports = router