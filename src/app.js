const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")
const {validate} = require("./utils/validate")
const bcrypt = require('bcrypt');
const cookieParcer = require('cookie-parser')
const jwt= require('jsonwebtoken')

app.use(express.json())
app.use(cookieParcer())



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


//check the user value
app.post ("/login" , async (req,res)=>{
  try{
    const {emailID , password} = req.body;

    const user = await User.findOne({emailID})
    if(!user){
      throw new Error("This account is not present in our Database please check and try again later")
    }

    const isLogin = await bcrypt.compare(password, user.password);

    if(!isLogin){

      throw new Error("password has been incorrect")

    }else{

      //making a jwt token

      const token = await jwt.sign({_id:user._id} , 'Common@123')

      //sending the jwt token to browser cookie
      res.cookie('token' , token)
      res.send("Login Has Been Successfull")
    }

  }catch(err){
    console.log('err: ', err);

  }
})


//get the profile of user

app.get("/profile" , async (req,res)=>{

  try{

    //getting the token from the browser
  const cookies = req.cookies;
  const { token} = cookies

  if(token){
    //verify the jwt token 
    const deodedmsg =await jwt.verify(token , 'Common@123')
  
  
    const user = await  User.findById({_id : deodedmsg._id})
    console.log('user: ', user);
    res.send(user)
  }else{
    throw new Error("Session time out please login first")
  }


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
