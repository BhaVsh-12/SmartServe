import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, Phone, Video, MoreVertical, Smile, ArrowLeft } from "lucide-react";

const mockChats = [
  {
    id: "user1",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastMessage: "When can you come to fix the pipe?",
    unread: 2,
    online: true,
  },
  {
    id: "user2",
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastMessage: "Thanks for the quick service!",
    unread: 0,
    online: false,
  },
];

const mockMessages = [
  {
    id: "1",
    senderId: "user1",
    receiverId: "me",
    content: "Hi, I have a leaking pipe in my kitchen.",
    timestamp: "09:30 AM",
  },
  {
    id: "2",
    senderId: "me",
    receiverId: "user1",
    content: "I can help you with that. Can you describe the issue in more detail?",
    timestamp: "09:32 AM",
  },
  {
    id: "3",
    senderId: "user1",
    receiverId: "me",
    content:
      "The pipe under the sink is dripping constantly. I've put a bucket underneath but it's filling up quickly.",
    timestamp: "09:35 AM",
  },
];

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full sm:w-80 border-r dark:border-gray-700 flex flex-col ${showSidebar ? "block" : "hidden sm:block"}`}>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setShowSidebar(false);
                }}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                  selectedChat.id === chat.id ? "bg-gray-50 dark:bg-gray-700" : ""
                }`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate">{chat.name}</h3>
                    {chat.unread > 0 && <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">{chat.unread}</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!showSidebar ? "block" : "hidden sm:block"}`}>
          {/* Chat Header */}
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSidebar(true)} className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <ArrowLeft size={20} />
              </button>
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h2 className="font-semibold">{selectedChat.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedChat.online ? "Online" : "Offline"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Phone size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Video size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((message) => (
              <div key={message.id} className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.senderId === "me" ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Smile size={24} />
              </button>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 rounded-full border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <button type="submit" className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors">
                <Send size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
