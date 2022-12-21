const router = require('express').Router()

const apiUsersRouter = require('./api/usersRouter')
const apiBlogsRouter = require('./api/blogsRouter')
const verifyJWT = require('../middleware/verifyJWT')
require("dotenv").config();

router.use('/users',apiUsersRouter)
router.use('/blogs',verifyJWT,apiBlogsRouter)

module.exports = router