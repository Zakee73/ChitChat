import mongoose from "mongoose";


const connectDb = async ()=>{

    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("MongoDb connection successful" )
    } catch (error) {
        console.log(error.message)
        console.log("MongoDB connection fail")
        process.exit(1)
    }
}
 
export default connectDb 
 
 