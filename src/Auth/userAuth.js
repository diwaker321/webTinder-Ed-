const jwt = require('jsonwebtoken')
const User = require("../models/user")
const userAuth = async(req,res,next)=>{
     try{
        const {token} = req.cookies
    
        if(!token) throw new Error('Token is not valid please log in again')
        const decodemsg = jwt.verify(token , 'Common@123')
        const {_id} = decodemsg
        const user = await User.findById({_id})
        req.user = user
        next();
    
      }catch(err){
        console.log('err: ', err);
      }

}
module.exports = userAuth