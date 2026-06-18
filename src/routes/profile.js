const express = require("express");
const userAuth = require("../Auth/userAuth");
const profileRouter = express.Router();

//get the profile of user
profileRouter.get("/profile" , userAuth, async(req,res)=>{
  try{
    const user = req.user
    res.send(user)
  }catch(err){
    console.log('err: ', err);
  }
})

module.exports = profileRouter
