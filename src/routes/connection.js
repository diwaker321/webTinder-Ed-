const express = require("express");
const userAuth = require("../Auth/userAuth");
const connectionRouter = express.Router();
const connectionRequest = require("../models/connectionSchema");
const User = require("../models/user");

//send the connection request using this api

// connectionRouter.post("/connectionRequest" , userAuth ,  (req,res)=>{
//   const user = req.user
//   res.send(`${user.firstname} send you the Connection Request`)
// })

connectionRouter.post(
  "/connectionRequest/send/:status/:userID",
  userAuth,
  async (req, res) => {
    try {
      const fromUserID = req.user._id;
      const toUserID = req.params.userID;
      const status = req.params.status;

      const toUserData = await User.findById(toUserID);

      // #1 validation one (if user send the request to itself)
      if (fromUserID.equals(toUserID)) {
        return res
          .status(400)
          .json({ message: "you can not send the request to yourself" });
      }

      // #2 validation two only intrested and ignored req accepted
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message:
            "Status Invalid please check. it can only be interested or ignored ",
        });
      }

      //#3 validation three check the person is existed or not jisko req. bhej rhe ho

      if (!toUserData) {
        return res.status(400).json({
          message: "User not found please check your toUserID",
        });
      }

      //#4 validation four check the existing connection is present or not

      const existingConnection = await connectionRequest.findOne({
        $or: [
          {
            fromUserID,
            toUserID,
          },
          {
            fromUserID: toUserID,
            toUserID: fromUserID,
          },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({
          message: "this request is already present",
        });
      }

      const newConnectionRequest = new connectionRequest({
        fromUserID: fromUserID,
        toUserID: toUserID,
        status: status,
      });

      const data = await newConnectionRequest.save();

      res.json({
        message: `${req.user.firstname} has send the req. to ${toUserData?.firstname}`,
        data: data,
      });
    } catch (err) {
      res.status(400).json({
        message: "Got error while sending request",
        error: err.message,
      });
    }
  },
);


connectionRouter.post("/request/review/:status/:requestId" , userAuth , async (req,res)=>{
  try{
    const {status , requestId} = req.params
    const loginuser = req.user

    const allowedStatus = ['accepted' , 'rejected']
    if(!allowedStatus.includes(status)){
      return res.status(400).send("Status is not valid ")

    }

    const reviewRequest = await connectionRequest.findOne({
      _id:requestId,
      status:'interested',
      toUserID:loginuser?._id
    })

    if(!reviewRequest){
      return res.status(400).send("Connection request not found")
    }
    reviewRequest.status=status

    const data = await reviewRequest.save()

    res.json({message:`Req has been ${reviewRequest?.status}` , data})

  }catch(err){
    res.status(400).send("Got an error",err)
  }
})


module.exports = connectionRouter;
