const jwt=require('jsonwebtoken');

const genarateToken=(id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET,{
        expiresIn:"10d"
    })
}
module.exports=genarateToken;