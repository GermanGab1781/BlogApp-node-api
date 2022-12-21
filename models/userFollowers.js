module.exports= (sequelize,type) =>{
  return sequelize.define('UserFollower',{},{
    timestamps:false
  })
}