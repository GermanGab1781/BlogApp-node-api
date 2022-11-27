const router = require('express').Router()

const apiUsersRouter = require('./api/usersRouter')
const apiBooksRouter = require('./api/booksRouter')
const middlewares = require('../middlewares')

router.use('/users',apiUsersRouter)
router.use('/books',apiBooksRouter)

module.exports = router