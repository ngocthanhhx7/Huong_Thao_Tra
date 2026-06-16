import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: 'Xin chào! Tôi là chuyên gia thảo mộc của Trà Hoa Việt. Tôi có thể gợi ý công thức trà, tư vấn nguyên liệu và hỗ trợ bạn chọn hương vị phù hợp. Bạn muốn bắt đầu từ đâu?',
    }]);
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
        setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/chatbot/message', { message: userMsg, historyId });
            setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
            if (res.data.historyId) {
                setHistoryId(res.data.historyId);
            }
        } catch (error) {
            console.error('Chatbot message error:', error);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Xin lỗi, kết nối tư vấn AI đang gián đoạn. Bạn thử gửi lại sau ít phút nhé.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="wellness-focus fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-xl bg-primary-700 text-white shadow-[0_14px_34px_rgba(47,101,40,0.22)] transition hover:bg-primary-600 active:scale-95"
                aria-label="Mở tư vấn AI"
            >
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M6 7c4 0 6 2 6 6-4 0-6-2-6-6ZM18 7c-4 0-6 2-6 6 4 0 6-2 6-6Z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-4 z-[10000] flex max-h-[85vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-[0_22px_54px_rgba(39,67,42,0.18)] sm:right-6 sm:w-[400px]">
            <div className="flex items-center justify-between border-b border-leaf-100 bg-primary-700 px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M6 7c4 0 6 2 6 6-4 0-6-2-6-6ZM18 7c-4 0-6 2-6 6 4 0 6-2 6-6Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold">AI Chuyên Gia</h3>
                        <p className="text-xs font-semibold text-primary-100">Sẵn sàng tư vấn trà thảo mộc</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="wellness-focus flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/15"
                    aria-label="Đóng tư vấn AI"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex min-h-[340px] flex-1 flex-col gap-4 overflow-y-auto bg-leaf-50 p-4 sm:min-h-[380px]" style={{ maxHeight: '60vh' }}>
                {messages.map((m, idx) => (
                    <div
                        key={`${m.role}-${idx}`}
                        className={`max-w-[86%] rounded-xl px-4 py-3 text-sm leading-7 shadow-sm ${
                            m.role === 'user'
                                ? 'self-end bg-primary-700 text-white'
                                : 'self-start border border-leaf-100 bg-white text-gray-800'
                        }`}
                    >
                        {m.role === 'assistant' ? (
                            <div className="chatbot-markdown max-w-none">
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                            </div>
                        ) : m.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-1.5 self-start rounded-xl border border-leaf-100 bg-white px-4 py-3 shadow-sm">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500" style={{ animationDelay: '0.15s' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-primary-500" style={{ animationDelay: '0.3s' }} />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-leaf-100 bg-white p-4">
                <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(e);
                        }
                    }}
                    placeholder="Hỏi AI về trà thảo mộc..."
                    className="wellness-focus min-h-11 flex-1 resize-none rounded-lg border border-leaf-100 bg-leaf-50 px-4 py-3 text-sm transition focus:bg-white"
                    style={{ maxHeight: '120px' }}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="wellness-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-white transition hover:bg-primary-600 disabled:bg-gray-300"
                    aria-label="Gửi tin nhắn"
                >
                    <svg className="h-5 w-5 translate-x-px" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 0 0-1.788 0l-7 14a1 1 0 0 0 1.169 1.409l5-1.429A1 1 0 0 0 9 15.571V11a1 1 0 1 1 2 0v4.571a1 1 0 0 0 .725.962l5 1.428a1 1 0 0 0 1.17-1.408l-7-14Z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatbotWidget;

