import dotenv from "dotenv"
import app from "./app.js"
import connectDb from "./db/dbConnection.js";

dotenv.config({
    path : './.env'
})

connectDb()
.then(()=>{
    app.listen(
        console.log(`Server is listening at port ${process.env.PORT}`))
})
.catch((err)=>{
    console.log("MongoDB connection failed" , err); 
}) 
