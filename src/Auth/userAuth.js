const jwt = require('jsonwebtoken')
const User = require("../models/user")
const userAuth = async(req,res,next)=>{
     try{
        const {token} = req.cookies
    
        // if(!token) throw new Error('Token is not valid please log in again')
        if(!token) return res.status(401).send("Please Log in")
        const decodemsg = jwt.verify(token , 'Common@123')
        const {_id} = decodemsg
        const user = await User.findById({_id})
        if(!user) throw new Error("user not found")
        req.user = user
        next();
    
      }catch(err){
       return res.status(401).send(err.message)
      }

}
module.exports = userAuth