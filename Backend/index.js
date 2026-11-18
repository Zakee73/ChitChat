import dotenv from "dotenv"
// import app from "./app.js"
import connectDb from "./db/dbConnection.js";
import { server } from "./socket/socket.js";

dotenv.config({
    path : './.env'
})

connectDb()
.then(()=>{
    server.listen( process.env.PORT , ()=>{
        console.log(`Server is listening at port ${process.env.PORT}`);})
})
.catch((err)=>{
    console.log("MongoDB connection failed" , err); 
})  
