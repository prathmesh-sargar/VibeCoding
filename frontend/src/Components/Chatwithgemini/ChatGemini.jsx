import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function ChatGemini() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");

    const userMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/aiagent`, { question });

      const aiMessage = { type: "ai", text: res.data.aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
            <p className="text-xs text-gray-500">Always here to help</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Powered by Gemini
        </div>
      </header>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/50 to-transparent"
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center text-gray-500"
          >
            <div className="w-32 h-32 mb-6 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">How can I help you today?</h2>
            <p className="max-w-md text-gray-600">Ask me anything about technology, business, or general knowledge.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
              {["Suggest a business idea", "Explain AI", "Best marketing strategies", "Tech trends 2024"].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
                  onClick={() => setQuestion(suggestion)}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-4 rounded-2xl max-w-3xl relative ${
                  msg.type === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-md"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm"
                }`}
              >
                {msg.type === "ai" && (
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
                )}
                {msg.type === "user" && (
                  <div className="absolute -right-2 top-0 w-4 h-4 bg-blue-500 transform rotate-45"></div>
                )}
                <div className="flex items-start space-x-3">
                  {msg.type === "ai" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      AI
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {msg.type === "user" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-200 max-w-xs shadow-sm relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
              <div className="flex space-x-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  AI
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pr-16 rounded-xl bg-gray-100 text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="Type your message here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAskQuestion();
                }
              }}
            />
            {question && (
              <button 
                onClick={() => setQuestion("")}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleAskQuestion}
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </motion.button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Press Enter to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGemini;