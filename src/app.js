const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")
const {validate} = require("./utils/validate")
const bcrypt = require('bcrypt');

app.use(express.json())


//signup your user with user info
app.post("/signup" , async (req,res)=>{
  try{
    //validate the user info 
      validate(req)
  
    //hash your password
    const {password} = req.body;

    const passwordHash = await bcrypt.hash(password , 10)
      // const user = new User(req.body) // dont do like this else you will face issues

      const user = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        emailID:req.body.emailID,
        password:passwordHash,
        gender:req.body.gender
      })
  
  
      await user.save()
      res.send("Data has been saved successfully")
  }catch(err){
    console.log('err: ', err);
  }

})


//get the data by of user jo apni mail id likhega ..

app.get("/user" , async (req,res)=>{
    const email = req.body.emailID // postman se jo email id aayi vo yha save hui

    const user = await User.find({emailID:email})
    if(user.length===0){
        res.status(404).send("user not found")
    }else{
        res.send(user)
    }
})

//get all the user data from /feed

app.get("/feed" , async (req,res)=>{
  try{
    const AllUser = await User.find({})
    res.send(AllUser)

  }catch (err){
        console.log("something went wrong" , err);     
  }
})

//get delete the user by id which user put

app.delete("/user" , async (req,res)=>{

  console.log('req.body: ', req.body);
  const user = req.body.id
  console.log('user: ', user);
  try{
    const  deletedUser  = await User.findByIdAndDelete(user)
    console.log('user: ', deletedUser);
    res.send("user has been deleted")

  }catch(err){
    console.log("something went wrong" , err);
    
  }

})


//get update the data with the help of id 

app.patch("/user/:userID" ,async (req , res)=>{
  try{
    const userID = req.params.userID 
    const AllowedUpdates = ["firstname" , "lastname" , "password" , "skills"]
    const isUpdatedAllowed = Object.keys(req.body).every(key=>AllowedUpdates.includes(key))
    if(!isUpdatedAllowed){
      throw new Error("update not allowed")
    }
    await User.findByIdAndUpdate({_id : userID} , req.body , {returnDocument:'after' , runValidators:true})
    res.send("user has been update")

  }catch(err){
    console.log("got some error while doing update operation" , err);
  }


  // try{
  //   const userID = req.body.id

  //   await User.findOneAndUpdate({firstname : req.body.firstname} , req.body , {returnDocument:'after' , runValidators:true})
  //   res.send("user has been update")

  // }catch(err){
  //   console.log("got some error while doing update operation");
  // }
})

connectDB()
  .then((res) => {
    console.log("Database connected sucessfully");

    app.listen("3000", () => {
      console.log("port is listing to 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot connected well");
  });
