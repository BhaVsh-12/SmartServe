// frontend/components/UserChat.js
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Send,
    Search,
    Phone,
    Video,
    MoreVertical,
    Smile,
    ArrowLeft,
    MessageSquarePlus, // Added icon for creating new chat
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom"; // Use useParams to get roomId
import Api from "../Api/capi";
import { io } from "socket.io-client";

export default function Chat() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const { darkMode } = useAppContext();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { roomId } = useParams(); // Get roomId from the URL

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("https://smartserve-z2ms.onrender.com");
        }

        if (selectedChat) {
            socketRef.current.emit("joinRoom", selectedChat.roomId);
            console.log(`Socket re-joined room: ${selectedChat.roomId}`);

            socketRef.current.on("receive_message", (message) => {
                console.log("Received message:", message);
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off("receive_message");
                if (selectedChat) {
                    socketRef.current.emit("leaveRoom", selectedChat.roomId);
                }
            }
        };
    }, [selectedChat]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await Api.get("/chat/api/getrooms", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChats(response.data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (roomId) {
                try {
                    setLoading(true);
                    const token = localStorage.getItem("token");
                    const response = await Api.get(`/chat/api/messages/${roomId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setMessages(response.data);
                    // Find and set the selected chat based on roomId
                    const foundChat = chats.find((chat) => chat.roomId === roomId);
                    setSelectedChat(foundChat || null);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    setMessages([]);
                    setSelectedChat(null); // Clear selected chat if room not found
                } finally {
                    setLoading(false);
                }
            } else {
                setMessages([]);
                setSelectedChat(null);
            }
        };
        fetchMessages();
    }, [roomId, chats]); // Added chats to dependency array to update selectedChat

    const filteredChats = chats.filter((chat) =>
        chat.servicemanname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const token = localStorage.getItem("token");
            const response = await Api.post(
                `/chat/api/send/${selectedChat.roomId}`,
                {
                    message: newMessage,
                    servicemanId: selectedChat.servicemanId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setNewMessage("");

            // Add the sent message to the local messages state
            setMessages((prevMessages) => [...prevMessages, response.data]); // response.data is now the message object
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const chatContainerClass = `${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg h-full flex overflow-hidden`;
    const textStyle = darkMode ? "text-white" : "text-gray-900";
    const mutedTextStyle = darkMode ? "text-gray-400" : "text-gray-500";
    const iconStyle = darkMode ? "text-gray-400" : "text-gray-500";
    const inputStyle = `w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`;
    const borderStyle = darkMode ? "border-gray-700" : "border-gray-200";
    const hoverStyle = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
    const selectedChatStyle = darkMode ? "bg-gray-700" : "bg-gray-100";
    const messageBgStyle = (sender) => (sender === "user" ? (darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900") : "bg-blue-500 text-white");

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading chats and messages...</div>; // More informative loading
    }

    const renderChatContent = () => {
        if (!roomId) {
            return (
                <div className="flex flex-col justify-center items-center h-full p-6">
                    <MessageSquarePlus className={`w-16 h-16 ${iconStyle} mb-4`} />
                    <h2 className={`text-xl font-semibold ${textStyle} mb-2`}>No conversation selected</h2>
                    <p className={`${mutedTextStyle} text-center mb-4`}>
                        Choose a conversation from the list to start chatting or create a new one.
                    </p>
                    {chats.length === 0 && !loading && (
                        <p className={`${mutedTextStyle} text-center`}>
                            You don't have any active conversations yet.
                        </p>
                    )}
                </div>
            );
        }

        if (!selectedChat && chats.length > 0) {
            return (
                <div className="flex flex-col justify-center items-center h-full p-6">
                    <h2 className={`text-xl font-semibold ${textStyle} mb-2`}>Loading Conversation...</h2>
                    <p className={`${mutedTextStyle} text-center mb-4`}>
                        Fetching messages for the selected chat. Please wait.
                    </p>
                    {/* You can add a spinner here if you have one */}
                </div>
            );
        }

        if (!selectedChat && chats.length === 0 && !loading) {
            return (
                <div className="flex flex-col justify-center items-center h-full p-6">
                    <MessageSquarePlus className={`w-16 h-16 ${iconStyle} mb-4`} />
                    <h2 className={`text-xl font-semibold ${textStyle} mb-2`}>No conversations</h2>
                    <p className={`${mutedTextStyle} text-center mb-4`}>
                        It seems you don't have any conversations yet. Once a service is booked or you initiate a chat, it will appear here.
                    </p>
                    {/* Optionally, a button to browse services */}
                </div>
            );
        }

        return (
            <>
                <div
                    className={`p-4 border-b ${borderStyle} flex justify-between items-center`}
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSidebar(true)}
                            className={`sm:hidden p-2 ${hoverStyle} rounded-lg ${iconStyle}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <img
                            src={selectedChat?.servicemanPhoto}
                            alt={selectedChat?.servicemanname}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <h2 className={`font-semibold ${textStyle}`}>
                                {selectedChat?.servicemanname}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className={`p-2 ${hoverStyle} rounded-full ${iconStyle}`}>
                            <Phone size={20} />
                        </button>
                        <button className={`p-2 ${hoverStyle} rounded-full ${iconStyle}`}>
                            <Video size={20} />
                        </button>
                        <button className={`p-2 ${hoverStyle} rounded-full ${iconStyle}`}>
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 ${messageBgStyle(message.sender)}`}
                            >
                                <p>{message.message}</p>
                                <p className="text-xs mt-1 opacity-70">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <form
                    onSubmit={handleSendMessage}
                    className={`p-4 border-t ${borderStyle}`}
                >
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`p-2 ${hoverStyle} rounded-full ${iconStyle}`}
                        >
                            <Smile size={24} />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className={inputStyle}
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                            <Send size={24} />
                        </button>
                    </div>
                </form>
            </>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto h-[calc(100vh-8rem)]"
        >
            <div className={chatContainerClass}>
                <div
                    className={`w-full sm:w-80 border-r ${borderStyle} flex flex-col ${showSidebar ? "block" : "hidden sm:block"}`}
                >
                    <div className="p-4">
                        <div className="relative">
                            <Search
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconStyle}`}
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={inputStyle}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat.roomId}
                                onClick={() => {
                                    setSelectedChat(chat);
                                    setShowSidebar(false);
                                    navigate(`/client/chat/${chat.roomId}`);
                                }}
                                className={`p-4 cursor-pointer transition-colors flex items-center gap-3 ${selectedChat?.roomId === chat.roomId ? selectedChatStyle : ""} ${hoverStyle}`}
                            >
                                <div className="relative">
                                    <img
                                        src={chat.servicemanPhoto}
                                        alt={chat.servicemanname}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold truncate ${textStyle}`}>
                                            {chat.servicemanname}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {chats.length === 0 && !loading && (
                            <div className="p-4 text-center ${mutedTextStyle}">No conversations found.</div>
                        )}
                    </div>
                </div>
                <div
                    className={`flex-1 flex flex-col ${!showSidebar ? "block" : "hidden sm:block"}`}
                >
                    {renderChatContent()}
                </div>
            </div>
        </motion.div>
    );
}