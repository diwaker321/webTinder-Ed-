const express = require('express')
const userAuth = require('../Auth/userAuth')
const connectionRouter = express.Router()


//send the connection request using this api 

connectionRouter.post("/connectionRequest" , userAuth ,  (req,res)=>{
  const user = req.user
  res.send(`${user.firstname} send you the Connection Request`)
})

module.exports=connectionRouter