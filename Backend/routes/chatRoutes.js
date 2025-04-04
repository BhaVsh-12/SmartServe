// backend/routes/chatRoutes.js
const express = require("express");
const Chat = require("../models/Chat");
const protectRoute = require("../middleware/authMiddleware");
const router = express.Router();
const User = require("../models/User");
const Serviceman = require("../models/Serviceman");

// 📩 Send a chat message (Client)
router.post("/send/:roomId", protectRoute("client"), async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { servicemanId, message } = req.body;
        const userId = req.user.id;
        const sender = "user";
        console.log("Received message data:", { roomId, userId, servicemanId, message, sender });

        const chat = await Chat.findOne({ roomId });

        if (chat) {
            chat.messages.push({ sender, message, timestamp: new Date() });
            await chat.save();
            const newMessage = chat.messages[chat.messages.length - 1]; // Get the newly added message
            req.io.to(roomId).emit("receive_message", newMessage);
            res.status(201).json(newMessage); // Send only the new message
        } else {
            const newChat = new Chat({
                roomId,
                userId,
                servicemanId,
                messages: [{ sender, message, timestamp: new Date() }],
            });

            await newChat.save();
            const newMessage = newChat.messages[0]; // Get the first message
            req.io.to(roomId).emit("receive_message", newMessage);
            res.status(201).json(newMessage); // Send only the new message
        }
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
});

// Get all rooms for a client
router.get("/getrooms", protectRoute("client"), async (req, res) => {
    try {
        const userId = req.user.id;
        const chatRooms = await Chat.find({ userId });

        if (chatRooms.length > 0) {
            const formattedRooms = chatRooms.map((room) => ({
                roomId: room.roomId,
                servicemanname: room.servicemanname,
                servicemanPhoto: room.servicemanPhoto,
            }));
            res.json(formattedRooms);
        } else {
            res.status(404).json({ message: "No rooms found" });
        }
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
});

// Fetch all messages for a chat room (Client)
router.get("/messages/:roomId", protectRoute("client"), async (req, res) => {
    try {
        const { roomId } = req.params;
        const chat = await Chat.findOne({ roomId });
        if (chat) {
            res.json(chat.messages);
        } else {
            res.status(404).json({ message: "Room not found" });
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});

// Create a room if it does not exist. (Client)
router.post("/createRoom", protectRoute("client"), async (req, res) => {
    try {
        const { servicemanId } = req.body;
        const clientId = req.user.id;
        const roomId = `${clientId}_${servicemanId}`;

        const existingChat = await Chat.findOne({ roomId });

        if (!existingChat) {
            const client = await User.findById(clientId);
            const serviceman = await Serviceman.findById(servicemanId);

            if (!client || !serviceman) {
                return res.status(404).json({ message: "User or Serviceman not found" });
            }

            const newChat = new Chat({
                roomId,
                userId: clientId,
                servicemanId,
                username: client.fullName,
                userPhoto: client.profilePhoto || undefined,
                servicemanname: serviceman.fullName,
                servicemanPhoto: serviceman.profilePhoto || undefined,
                messages: [],
            });

            await newChat.save();
            res.status(201).json({ roomId, message: "Room created successfully", newChat });
        } else {
            res.status(200).json({ roomId, message: "Room already exists", existingChat });
        }
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Failed to create room" });
    }
});

// Serviceman routes

// Serviceman fetch messages
router.get("/serviceman/messages/:roomId", protectRoute("serviceman"), async (req, res) => {
    try {
        const { roomId } = req.params;
        const chat = await Chat.findOne({ roomId });
        if (chat) {
            res.json(chat.messages);
        } else {
            res.status(404).json({ message: "Room not found" });
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});

// Serviceman send message
router.post("/serviceman/send/:roomId", protectRoute("serviceman"), async (req, res) => {
    try {
        const { roomId } = req.params;
        const { message } = req.body;
        const servicemanId = req.user.id;
        const sender = "serviceman";

        const chat = await Chat.findOne({ roomId });
        if (chat) {
            chat.messages.push({ sender, message, timestamp: new Date() });
            await chat.save();
            const newMessage = chat.messages[chat.messages.length - 1];
            req.io.to(roomId).emit("receive_message", newMessage);
            res.status(201).json(newMessage); // Send only the new message
        } else {
            res.status(404).json({ message: "Room not found" });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
});

// Get all rooms for a serviceman
router.get("/serviceman/getrooms", protectRoute("serviceman"), async (req, res) => {
    try {
        const servicemanId = req.user.id;
        const chatRooms = await Chat.find({ servicemanId });

        if (chatRooms.length > 0) {
            const formattedRooms = chatRooms.map((room) => ({
                roomId: room.roomId,
                clientname: room.username,
                clientPhoto: room.userPhoto,
            }));
            res.json(formattedRooms);
        } else {
            res.status(404).json({ message: "No rooms found" });
        }
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
});

module.exports = router;