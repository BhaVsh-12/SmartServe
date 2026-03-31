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
    MessageSquarePlus,
    Inbox
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../Api/capi";
import { io } from "socket.io-client";
import { useTheme } from "../hooks/useTheme";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const emptyChatListVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut", delay: 0.2 } },
};

const noChatSelectedVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut", delay: 0.2 } },
};

export default function ServicemanChat() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const { roomId: routeRoomId } = useParams();
    const { theme } = useTheme();
    const darkMode = theme === "dark";
    const socketRef = useRef(null);
    const selectedChatRef = useRef(selectedChat); 
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(API_BASE_URL);
        }

        const socket = socketRef.current;

       
        socket.on("receive_message", (message) => {
            console.log("Received message:", message);
            setMessages((prevMessages) => {
                const currentSelectedChat = selectedChatRef.current;
                if (currentSelectedChat && message.roomId === currentSelectedChat.roomId) {
                    // skip if it's from self (already added optimistically)
                    if (message.sender === "serviceman") return prevMessages;
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
        });

        return () => {
            if (socket) {
                socket.off("receive_message");
            }
        };
    }, []); 

    useEffect(() => {
        const socket = socketRef.current;
        if (socket && selectedChat) {
            socket.emit("joinRoom", selectedChat.roomId);
            console.log(`Socket joined room: ${selectedChat.roomId}`);
        }
    }, [selectedChat]);


    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await Api.get("/chat/api/serviceman/getrooms", {
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
            if (routeRoomId && chats.length > 0) {
                try {
                    setLoading(true);
                    const foundChat = chats.find((chat) => chat.roomId === routeRoomId);
                    if (foundChat) {
                        setSelectedChat(foundChat);
                        const token = localStorage.getItem("token");
                        const response = await Api.get(`/chat/api/serviceman/messages/${routeRoomId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setMessages(response.data);
                    } else {
                        console.error("Room specified in URL not found for this serviceman.");
                        setMessages([]);
                        setSelectedChat(null);
                        navigate("/service/chat");
                    }
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    setMessages([]);
                    setSelectedChat(null);
                    navigate("/service/chat");
                } finally {
                    setLoading(false);
                }
            } else if (!routeRoomId) {
                setMessages([]);
                setSelectedChat(null);
            }
        };
        fetchMessages();
    }, [routeRoomId, chats, navigate]);


    const filteredChats = chats.filter(
        (chat) =>
            !searchTerm ||
            (chat.clientname &&
                typeof chat.clientname === "string" &&
                chat.clientname.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const optimisticMsg = { sender: "serviceman", message: newMessage, timestamp: new Date() };
        setMessages((prev) => [...prev, optimisticMsg]);
        setNewMessage("");

        try {
            const token = localStorage.getItem("token");
            await Api.post(
                `/chat/api/serviceman/send/${selectedChat.roomId}`,
                { message: optimisticMsg.message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => prev.filter((m) => m !== optimisticMsg));
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
    const messageBgStyle = (sender) => (sender === "serviceman" ? "bg-blue-500 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900");

    if (loading && (!selectedChat || messages.length === 0)) {
        return <div className={`max-w-6xl mx-auto h-[calc(100vh-8rem)] flex justify-center items-center ${textStyle}`}>Loading chats...</div>;
    }

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
                        {chats.length === 0 ? (
                            <motion.div
                                variants={emptyChatListVariants}
                                initial="initial"
                                animate="animate"
                                className="flex flex-col justify-center items-center p-6"
                            >
                                <Inbox size={48} className={iconStyle} />
                                <p className={`mt-3 ${mutedTextStyle} text-center`}>No chats available yet.</p>
                            </motion.div>
                        ) : filteredChats.length === 0 && searchTerm ? (
                            <div className="flex flex-col justify-center items-center p-6">
                                <Search size={48} className={iconStyle} />
                                <p className={`mt-3 ${mutedTextStyle} text-center`}>No chats found for "{searchTerm}".</p>
                            </div>
                        ) : (
                            filteredChats.map((chat) => (
                                <div
                                    key={chat.roomId}
                                    onClick={() => {
                                        setShowSidebar(false);
                                        navigate(`/service/chat/${chat.roomId}`);
                                    }}
                                    className={`p-4 cursor-pointer transition-colors flex items-center gap-3 ${selectedChat?.roomId === chat.roomId ? selectedChatStyle : ""} ${hoverStyle}`}
                                >
                                    <div className="relative">
                                        <img
                                            src={chat.clientPhoto}
                                            alt={chat.clientname}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-semibold truncate ${textStyle}`}>
                                                {chat.clientname}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div
                    className={`flex-1 flex flex-col ${!showSidebar ? "block" : "hidden sm:block"} ${chats.length === 0 ? "justify-center items-center" : ""}`}
                >
                    {!selectedChat ? (
                        <motion.div
                            variants={noChatSelectedVariants}
                            initial="initial"
                            animate="animate"
                            className="flex flex-col justify-center items-center h-full p-6"
                        >
                            <MessageSquarePlus size={60} className={iconStyle} />
                            <p className={`mt-3 ${mutedTextStyle} text-center text-lg`}>Select a chat to start messaging.</p>
                            {chats.length > 0 && (
                                <p className={`mt-1 ${mutedTextStyle} text-center text-sm`}>Click on a conversation in the sidebar to view messages.</p>
                            )}
                            {chats.length === 0 && (
                                <p className={`mt-1 ${mutedTextStyle} text-center text-sm`}>Once a client initiates a chat, it will appear here.</p>
                            )}
                        </motion.div>
                    ) : (
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
                                        src={selectedChat.clientPhoto}
                                        alt={selectedChat.clientname}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h2 className={`font-semibold ${textStyle}`}>
                                            {selectedChat.clientname}
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
                                        className={`flex ${message.sender === "serviceman" ? "justify-end" : "justify-start"}`}
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
                    )}
                </div>
            </div>
        </motion.div>
    );
}