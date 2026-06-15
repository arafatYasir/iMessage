import express from "express";
import http from "http";
import { Server } from "socket.io";
import { SITE_URL } from "../config/env.js";

const app = express();
const httpServer = http.createServer(app);

const allowedOrigin = SITE_URL || "http://localhost:5173";

const io = new Server(httpServer, {
    cors: { origin: [allowedOrigin] }
});

const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export { app, httpServer, io, getReceiverSocketId };