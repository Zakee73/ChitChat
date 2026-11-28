import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.middleware.js";

import {
  sendMessage,
  getMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router
  .route("/send/:id")
  .post(isAuthenticated, upload.single("attachment"), sendMessage);

router
  .route("/:id")
  .get(isAuthenticated, getMessage);

export default router;