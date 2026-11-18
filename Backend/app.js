import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true 
}))

import userRoute from "./routes/user.route.js"
import messageRoute from "./routes/message.routes.js"
app.use("/api/v1/users" ,userRoute)
app.use("/api/v1/message" ,messageRoute)

export default app