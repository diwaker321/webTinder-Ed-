const jwt = require("jsonwebtoken");
const User = require("../models/user")

const jwtAuth = async (req, res, next) => {
  try{
    const cookie = req.cookies;
  const { token } = cookie;

  if(!token){
    throw new Error("Session Time Out Please Login Again")
  }else{
    const decodedmsg = await jwt.verify(token ,'Common@123');
    const {_id} = decodedmsg;
    const user = await User.findById({_id})
    req.user = user
    next()

  }

  }catch(err){
    console.log('err: ', err);

  }
};

module.exports = { jwtAuth };
