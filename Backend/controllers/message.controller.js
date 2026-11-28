import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const message = req.body.message?.trim() || "";
    const file = req.file;

    if (!message && !file) {
      return res.status(400).json({
        message: "Message or attachment is required",
      });
    }

    let attachment = {};
    let messageType = "text";

    if (file) {
      const uploadedFile = await uploadOnCloudinary(file.path);

      if (!uploadedFile) {
        return res.status(500).json({
          message: "File upload failed",
        });
      }

      const mimeType = file.mimetype;

      if (mimeType.startsWith("image/")) {
        messageType = "image";
      } else if (mimeType.startsWith("video/")) {
        messageType = "video";
      } else {
        messageType = "file";
      }

      attachment = {
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        fileName: file.originalname,
        mimeType,
        size: uploadedFile.bytes,
      };
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      messageType,
      attachment,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({ newMessage });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Send message error:", error);

    return res.status(500).json({
      message: error.message || "Failed to send message",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    return res.status(200).json(conversation?.messages || []);
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      message: "Failed to load messages",
    });
  }
};