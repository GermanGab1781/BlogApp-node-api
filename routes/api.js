const router = require('express').Router()

const apiUsersRouter = require('./api/usersRouter')
const apiBooksRouter = require('./api/booksRouter')
const {verifyJWT} = require('../middlewares')

router.use('/users',apiUsersRouter)
router.use('/books',verifyJWT,apiBooksRouter)

module.exports = router