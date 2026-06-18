const express = require('express')
const authRouter = express.Router()
const bcrypt = require("bcrypt");
const User = require("../models/user")
const jwt = require('jsonwebtoken');
const { validate } = require('../utils/validate');


authRouter.post("/signup", async (req, res) => {
  try {
    validate(req)

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
authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID });
    if (!user) {
      throw new Error("User is not found please check");
    } else {
      const isLogin = await bcrypt.compare(password , user?.password)
      if(!isLogin) throw new Error('Invalid Credencials , please check')

        //make a jwt token
        const token = await user.getJWT()
        res.cookie('token' , token)
      res.send(user);
    }
  } catch (err) {
    console.log("err: ", err);
  }
});

module.exports = authRouter;
