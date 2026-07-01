const express = require("express");
const userAuth = require("../Auth/userAuth");
const { validateEditValues } = require("../utils/validate");
const profileRouter = express.Router();

//get the profile of user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send(err)
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValid = validateEditValues(req);
    if (isValid) {
      let loginUser = req.user;
      // console.log(loginUser);

      Object.keys(req.body).forEach((res) => (loginUser[res] = req.body[res]));
      await loginUser.save();

      // res.send(loginUser)
      res.json({ message: "Your feilds have been updates Successfully" , data:loginUser });
    } else {
     return res.status(400).send("Invalid Edit Please Check");
    }
  } catch (err) {
    console.log("err: ", err);
  }
});

module.exports = profileRouter;
