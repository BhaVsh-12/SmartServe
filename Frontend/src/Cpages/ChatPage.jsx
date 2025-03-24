import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Image, File } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const ChatPage = () => {
  const { conversations, darkMode } = useAppContext();
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [message, setMessage] = useState("");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto h-[calc(100vh-120px)]">
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>Messages</h1>

      <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full ${darkMode ? "text-white" : "text-gray-800"}`}>
        {/* Conversations List */}
        <div className={`md:col-span-1 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg overflow-hidden`}>
          <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <h2 className="font-semibold">Recent Conversations</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`
                  p-4 cursor-pointer transition-colors duration-200
                  ${selectedConversation.id === conversation.id 
                    ? darkMode ? "bg-gray-700" : "bg-indigo-50" 
                    : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                  ${conversation.id !== conversations[conversations.length - 1].id 
                    ? darkMode ? "border-b border-gray-700" : "border-b border-gray-200" 
                    : ""}
                `}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img src={conversation.participantAvatar} alt={conversation.participantName} className="w-10 h-10 rounded-full object-cover" />
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{conversation.participantName}</h3>
                      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{conversation.lastMessageTime.split(" ")[0]}</span>
                    </div>
                    <p className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{conversation.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-t-xl shadow-sm flex items-center`}>
                <img src={selectedConversation.participantAvatar} alt={selectedConversation.participantName} className="w-10 h-10 rounded-full object-cover mr-3" />
                <div>
                  <h3 className="font-medium">{selectedConversation.participantName}</h3>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className={`flex-1 p-4 overflow-y-auto ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="space-y-4">
                  {selectedConversation.messages.map((msg) => {
                    const isCurrentUser = msg.senderId === "user1";
                    return (
                      <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        <div className="flex max-w-[80%]">
                          {!isCurrentUser && <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover mr-2 self-end" />}
                          <div>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-lg p-3 ${isCurrentUser ? darkMode ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white" : darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
                              <p className="text-sm">{msg.content}</p>
                            </motion.div>
                            <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{msg.timestamp.split(" ")[1]}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-b-xl shadow-sm`}>
                <div className="flex items-center">
                  <button onClick={handleSendMessage} className={`p-3 rounded-full ${message.trim() ? "bg-indigo-600 hover:bg-indigo-700 text-white" : darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}`} disabled={!message.trim()}>
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`flex-1 flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl`}>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
