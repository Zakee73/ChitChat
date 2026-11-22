import mongoose from "mongoose";
import { Schema }  from "mongoose";

const UserSchema = new Schema({
username : { type : String , required : true },
// fullName : { type : String , unique : true},
email : { type : String , required : true , unique : true},
password : { type : String , required : true},
coverImage : {type : String , required  :true}, // Cloudinary Url
token : {type : String ,},   
},{timestamps : true})

const User = mongoose.model("User" , UserSchema)
export  {User} 