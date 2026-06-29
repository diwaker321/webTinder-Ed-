const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParcer = require("cookie-parser");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const connectionRouter = require("./routes/connection");
const userRouter = require("./routes/user");
const cors = require('cors')


app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json());
app.use(cookieParcer());

app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , connectionRouter)
app.use("/" , userRouter)

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
