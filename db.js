const Sequelize = require('sequelize')
const { HasMany, BelongsTo } = require('sequelize')

const UserModel= require('./models/users')
const BookModel= require('./models/books')
const UserBooks= require('./models/usersBooks')

//Database Host
const sequelize = new Sequelize('nodeportfoliogg','germanchhow','qweqweqwe123',{
  host:'db4free.net',
  dialect: 'mysql'
})


const Book = BookModel(sequelize,Sequelize)
const User = UserModel(sequelize,Sequelize)

Book.belongsTo(User,{through:UserBooks})
User.hasMany(Book,{onDelete:'CASCADE'})


sequelize.sync({alter:true})

module.exports ={Book,User}