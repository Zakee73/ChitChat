import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";

import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(upload.single("coverImage"),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)

export default router 