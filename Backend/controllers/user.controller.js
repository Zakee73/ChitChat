import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import  jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async(req, res)=>{

    const { username , email , password } = req.body
    // Checking if any field is empty
    if([ username , email , password ].some((field)=>{
        field?.trim() === ""
    })){
        throw new ApiError(401 ,"Please enter email and password")
    }
     // Finding for a user if already exists

     const existedUser = await User.findByOne({
        $or : [{ email },{ password }]
     })
     if(existedUser){
        throw new ApiError(400 , " User Already exists with this email");
     }
     
 
      let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage){
        throw new ApiError(400 , "Avtar file is required")
    }
})

const loginUser = asyncHandler(async(req, res) =>{
 
    const {email , password} = req.body
    // Checking whether user exists or not
    const user = await User.findOne({email})
    if(!user){
     throw new ApiError(401 , " User not found Register first")
    }

    const checkPassword = await bcrypt.compare(password , user.password);
    if(!checkPassword){
        throw new ApiError(401 ,  " Invalid Password")
    }  
const token = jwt.sign({
    _id : user._id,
    email : user.email,
    password : user.password},
process.env.ACCESS_TOKEN_SECRET,
{ expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
)
if(!token){
    throw new ApiError(500, "token not generated")
}

const loggedInUser = await User.findById(user._id).select("-password -token")

return res
.status(200)
.cookie("token", token , {httpOnly : true, secure : true})
.json(new ApiResponse(200 , {user: loggedInUser} , "User loggedin Successfully"))
})

const logoutUser = asyncHandler(async(req,res)=>{

    return res
    .clearCookie("token" , {httpOnly : true, secure : true})
    .json( new ApiResponse(201, {} ," User Logged Out Successfully" ))

})



export{registerUser,loginUser,logoutUser}