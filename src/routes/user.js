const express = require('express');
const userAuth = require('../Auth/userAuth');
const userRouter = express.Router()
const connectionList = require("../models/connectionSchema")
const Usermodel = require("../models/user")

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

userRouter.get("/user/connection", userAuth, async(req,res)=>{
    const loginUser = req.user;
    const connectionlist = await connectionList.find({
        $or:[
            {toUserID:loginUser._id , status:'accepted' },
            {fromUserID:loginUser._id , status:'accepted'}
        ]
    }).populate("fromUserID" , "firstname lastname").populate("toUserID" , "firstname lastname")

    res.json({message:"this is your all accecpted list" , data:connectionlist})
})

userRouter.get("/user/feed" , userAuth , async (req,res)=>{
    const loginUser = req.user;
    //login user kisko kisko nhi deakega feed me ?
        //khud ko 
        //jisko usne req bheji
        //jisne login user ko req bheji.

    const connectionRequest = await connectionList.find({
        $or:[{fromUserID:loginUser._id},{toUserID:loginUser._id}]
    }).select("fromUserID toUserID status")

    const notallowedUsers = new Set()
    connectionRequest.forEach((res)=>{
        notallowedUsers.add(res.fromUserID.toString())
        notallowedUsers.add(res.toUserID.toString())
    })
    notallowedUsers.add(loginUser._id.toString());
    
    // console.log('notallowedUsers: ', notallowedUsers);

    const feedUsers = await Usermodel.find({
        _id:{ $nin:[...notallowedUsers]}
    }).select("firstname lastname emailID")
    // console.log('feedUsers: ', feedUsers);
    res.send(feedUsers)
})

module.exports = userRouter;