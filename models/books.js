module.exports = (sequelize , type) =>{
  return sequelize.define('book',{
    id:{
      type: type.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    title: type.STRING,
    overview: type.STRING,
    sellCount: type.INTEGER,
    writer:type.STRING
  })
}