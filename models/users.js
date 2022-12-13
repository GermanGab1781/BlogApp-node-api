module.exports= (sequelize,type)=>{
  return sequelize.define('user',{
    id:{
      type: type.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    username:type.STRING,

    role:type.STRING,

    email:type.STRING,

    password:type.STRING,

    refreshToken:{
      type:type.STRING,
      defaultValue: " "
    }
  })
}