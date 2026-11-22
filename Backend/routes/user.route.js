import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";

import { loginUser, logoutUser, registerUser,getAllUsers } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router()

router.route("/register").post(upload.single("coverImage"),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/").get(isAuthenticated ,getAllUsers)

export default router  