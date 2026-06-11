const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://diwakeracadmic:ZC86Mbt3H6on8yLM@webtinder.2oebmit.mongodb.net/webtinder")
}

module.exports = connectDB

