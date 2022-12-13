const Sequelize = require('sequelize')
const { HasMany, BelongsTo } = require('sequelize')
require("dotenv").config();

const UserModel= require('./models/users')
const BookModel= require('./models/books')
const UserBooks= require('./models/usersBooks')

//Database Host
const sequelize = new Sequelize(process.env.NODE_DATABASE_NAME,process.env.NODE_DATABASE_USERNAME,process.env.NODE_DATABASE_PASSWORD,{
  host:process.env.NODE_DATABASE_HOST,
  dialect: process.env.NODE_DATABASE_DIALECT
})


const Book = BookModel(sequelize,Sequelize)
const User = UserModel(sequelize,Sequelize)

Book.belongsTo(User,{through:UserBooks})
User.hasMany(Book,{onDelete:'CASCADE'})


sequelize.sync({})

module.exports ={Book,User}