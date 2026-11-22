import { Server } from "socket.io";
import http from "http";
import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    console.log("User connected:", userId, socket.id);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
        }

        console.log("User disconnected:", userId);

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };