module.exports= (sequelize,type) =>{
  return sequelize.define('UsersBlogs',{
    id:{
      type: type.INTEGER,
        primaryKey: true,
        autoIncrement:true
    }
  },{
    timestamps:false
  })
}