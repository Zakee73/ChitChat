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

import userRouter from "./routes/user.route.js"

app.use("api/v1/users" , userRouter)

export default app