module.exports= (sequelize,type) =>{
  return sequelize.define('UsersBooks',{
    id:{
      type: type.INTEGER,
        primaryKey: true,
        autoIncrement:true
    }
  },{
    timestamps:false
  })
}