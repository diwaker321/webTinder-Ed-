const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validate } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParcer = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./Auth/userAuth");

app.use(express.json());
app.use(cookieParcer());

app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    validate(req);

    const haspassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      emailID: req.body.emailID,
      gender: req.body.gender,
      password: haspassword,
    });

    await newUser.save();
    res.send("user has signed up");
  } catch (err) {
    console.log("err: ", err);
  }
});

//api for userLogin
app.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID });
    console.log("user: ", user);
    if (!user) {
      throw new Error("User is not found please check");
    } else {
      const isLogin = await bcrypt.compare(password , user?.password)
      if(!isLogin) throw new Error('Invalid Credencials , please check')

        //make a jwt token
        const token = jwt.sign({_id : user._id} , 'Common@123' , { expiresIn: '1h' })
        res.cookie('token' , token , {expires:'1h'})
      res.send(user);
    }
  } catch (err) {
    console.log("err: ", err);
  }
});

//get the profile of user
app.get("/profile" , userAuth , async(req,res)=>{
  try{
    const user = req.user
    res.send(user)
  }catch(err){
    console.log('err: ', err);
  }
})


//send the connection request using this api 

app.post("/connectionRequest" , userAuth ,  (req,res)=>{
  const user = req.user
  res.send(`${user.firstname} send you the Connection Request`)
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
