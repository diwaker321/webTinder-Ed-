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

const validateEditValues = (req)=>{
    const editValues = ["firstname" , "lastname" , "skills" , "age" , "gender"]

    const isInclude =  Object.keys(req.body).every(res=>editValues.includes(res))
    return isInclude;

}

// const validateEditValues = (req)=>{
//     const validValues = [firstname , lastname, age, gender , skills]
//     const isvalid =  Object.keys(req.body).every(key =>validValues.includes(key))
//     return isvalid;
// }

module.exports = {validate , validateEditValues }