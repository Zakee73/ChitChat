import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register" , registerUser)
router.route("/login" , loginUser)
router.route("/logout" , logoutUser)

export default router