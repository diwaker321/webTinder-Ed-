const validator = require('validator')

const validate = (req)=>{
    const {firstname , lastname , emailID , password , gender} = req.body

    if(!firstname.trim() || !lastname.trim()){
        throw new Error("please fill the name correctly")
    }
    else if (!validator.isEmail(emailID)){
        throw new Error("please fill the Email correctly")
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("Your password is not so strong")
    }
}

module.exports = {validate}