// src/components/home/AIChat.jsx
import { useRef, useEffect } from "react";
import { X, Sparkles, Loader2, Send } from "lucide-react";

const AIChat = ({ theme, isOpen, onToggle, messages, input, setInput, onSend, loading }) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const quickQuestions = [
    { icon: '💻', text: 'Texnologiya loyihalari', query: 'Texnologiya sohasida qanday loyihalar bor?' },
    { icon: '👥', text: 'Sherik topish', query: 'Qanday qilib sherik topishim mumkin?' },
    { icon: '🚀', text: 'Loyiha yaratish', query: 'Loyiha yaratish uchun nima kerak?' },
  ];

  return (
    <>
      {/* Trigger tugmasi */}
      <button
        onClick={onToggle}
        className={`fixed right-6 bottom-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-blue-600 to-indigo-600 text-white ${isOpen ? 'rotate-180' : ''}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {/* Sidebar panel */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 ${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-l shadow-2xl z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Yordamchi</h3>
              <p className="text-sm text-white/80">Groq AI powered</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 180px)' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-100 rounded-bl-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} px-4 py-3 rounded-2xl rounded-bl-md`}>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Javob yozilmoqda...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Tez savollar */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Tez savol:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q.query);
                    setTimeout(onSend, 100);
                  }}
                  className={`px-3 py-1.5 ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  } rounded-lg text-xs transition`}
                >
                  {q.icon} {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 ${
          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        } border-t`}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSend()}
              placeholder="Savol bering..."
              disabled={loading}
              className={`flex-1 px-4 py-3 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm`}
            />
            <button
              onClick={onSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 sm:hidden" onClick={onToggle} />
      )}
    </>
  );
};

export default AIChat;