const express = require('express');
const userAuth = require('../Auth/userAuth');
const userRouter = express.Router()
const connectionList = require("../models/connectionSchema")

userRouter.get("/user/pendingRequest" , userAuth , async (req,res)=>{
    try{
        const loginuser = req.user
        const reviewList = await connectionList.find({
            status:'interested',
            toUserID :loginuser._id
        }).populate("fromUserID" , ['firstname' , 'lastname'])
        res.json({message:"Your list" , data:reviewList})
    }catch(err){
        res.status(400).send(err)
    }
})

module.exports = userRouter;