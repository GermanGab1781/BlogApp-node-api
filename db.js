const Sequelize = require('sequelize')
const { HasMany, BelongsTo, BelongsToMany } = require('sequelize')
require("dotenv").config();
const UserModel = require('./models/users')
const BlogModel = require('./models/blogs')
const UserBlogs = require('./models/usersBlogs');


//Database Host
const sequelize = new Sequelize(process.env.NODE_DATABASE_NAME, process.env.NODE_DATABASE_USERNAME, process.env.NODE_DATABASE_PASSWORD, {
  host: process.env.NODE_DATABASE_HOST,
  dialect: process.env.NODE_DATABASE_DIALECT
})


const Blog = BlogModel(sequelize, Sequelize)
const User = UserModel(sequelize, Sequelize)

User.belongsToMany(User,{as:'followers',through:'userFollowers',foreignKey:'follower_id',otherKey:'following_id'})
User.belongsToMany(User,{as:'following',through:'userFollowers',foreignKey:'following_id',otherKey:'follower_id'})


Blog.belongsTo(User, { through: UserBlogs })
User.hasMany(Blog)



sequelize.sync({})

module.exports = { Blog, User }