const Sequelize = require('sequelize')

const UserModel= require('./models/users')
const BookModel= require('./models/books')

//Database Host
const sequelize = new Sequelize('nodeportfoliogg','germanchhow','qweqweqwe123',{
  host:'db4free.net',
  dialect: 'mysql'
})


const Book = BookModel(sequelize,Sequelize)
const User = UserModel(sequelize,Sequelize)

sequelize.sync()

module.exports ={Book,User}