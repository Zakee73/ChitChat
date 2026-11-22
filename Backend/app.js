import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express()

app.use(cookieParser()) 
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

import userRoute from "./routes/user.route.js"
import messageRoute from "./routes/message.routes.js"
app.use("/api/v1/users" ,userRoute)
app.use("/api/v1/message" ,messageRoute)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: err.success ?? false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development"
            ? err.stack
            : undefined
    });
});

export default app