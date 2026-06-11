const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  emailID: {
    type: String,
    required:true,
    trim:true,
    lowercase:true,
    unique:true
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value){ // this is how you put the custom validation in your code 
      if(!["male" , "female" , "others"].includes(value)){
        throw new Error("Gender data is not valid")
      }
    },
    lowercase:true,
  },

  skills:{
    type:[String]
  }
} , { timestamps: true });

module.exports  = mongoose.model("User" , userSchema)
