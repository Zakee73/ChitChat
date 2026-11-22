
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
const isAuthenticated = asyncHandler(async (req ,res,next)=>{
  
  try{  const token = req.cookies?.token;
    if(!token){
        throw new ApiError(401,"Toekn not found")
    }
    const checktoken = await jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(checktoken?._id).select("-password")
      if(!user){
        throw new ApiError(401 , "Invalid Access Token")
      }
      req.user = user;
      console.log(req.user)
      next();
    }catch(error){
        throw new ApiError(401 , error?.message || "Invalid Access Token")
    }
})
 export default isAuthenticated