import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'assistant', content: 'Xin chào! Tôi là chuyên gia thảo mộc của Hương Thảo Trà. Tôi có thể giúp bạn gợi ý công thức trà, tư vấn sức khỏe hoặc xây dựng liệu trình uống trà phù hợp. Bạn cần tư vấn gì?' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [historyId, setHistoryId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/chatbot/message', { message: userMsg, historyId });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
            if (res.data.historyId) {
                setHistoryId(res.data.historyId);
            }
        } catch (error) {
            console.error('Chatbot message error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, tôi đang gặp sự cố kết nối lúc này.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-primary-600 to-primary-400 text-white rounded-full shadow-[0_8px_30px_-6px_rgba(16,185,129,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 z-50">
                <span className="text-2xl drop-shadow-sm">✨</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[360px] sm:w-[400px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col border border-gray-100 z-50 overflow-hidden transform transition-all duration-300 origin-bottom-right" style={{ maxHeight: '85vh' }}>
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">🌿</div>
                    <div>
                        <h3 className="font-bold text-sm tracking-wide">AI Chuyên Gia</h3>
                        <p className="text-[10px] text-primary-100 uppercase tracking-wider font-semibold">Sẵn sàng tư vấn</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto bg-gray-50 flex flex-col gap-4 scroll-smooth" style={{ minHeight: '380px', maxHeight: '60vh' }}>
                {messages.map((m, idx) => (
                    <div key={idx} className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white self-end rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 self-start rounded-2xl rounded-tl-sm'}`}>
                        {m.role === 'assistant' ? (
                            <div className="chatbot-markdown prose-sm max-w-none">
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                            </div>
                        ) : m.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="self-start bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 items-end">
                <textarea
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                    placeholder="Hỏi AI về trà thảo mộc..."
                    className="flex-1 p-3 px-4 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:bg-white resize-none transition-all duration-200"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="h-11 w-11 flex-shrink-0 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:bg-gray-300 disabled:hover:bg-gray-300 focus:outline-none transition-colors shadow-sm">
                    <svg className="w-5 h-5 translate-x-px" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                </button>
            </form>
        </div>
    );
};

export default ChatbotWidget;
