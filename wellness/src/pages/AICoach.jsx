import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@shared/api';
import ReactMarkdown from 'react-markdown';

const MOODS = [
  { emoji: '😊', label: 'Vui vẻ', value: 'happy' },
  { emoji: '😌', label: 'Bình yên', value: 'calm' },
  { emoji: '😐', label: 'Bình thường', value: 'neutral' },
  { emoji: '😔', label: 'Buồn', value: 'sad' },
  { emoji: '😤', label: 'Căng thẳng', value: 'stressed' },
];

function AIMessage({ message }) {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] bg-leaf-50 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="prose prose-sm">
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[80%] bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

export default function AICoach() {
  const [tab, setTab] = useState('checkin');

  const [checkinForm, setCheckinForm] = useState({
    sleepHours: '',
    stressLevel: 5,
    mood: '',
    exerciseMinutes: '',
    waterGlasses: '',
  });
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinResult, setCheckinResult] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  const handleCheckin = async (e) => {
    e.preventDefault();
    setCheckinLoading(true);
    setCheckinResult(null);
    try {
      const { data } = await api.post('/wellness/coach/checkin', checkinForm);
      setCheckinResult(data);
    } catch {
      setCheckinResult({ advice: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setCheckinLoading(false);
    }
  };

  const handleCheckinChange = (field, value) => {
    setCheckinForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChatSend = async (e) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    const newMessages = [...chatMessages, { role: 'user', content: text }];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const history = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/wellness/coach/chat', { message: text, history });
      setChatMessages([...newMessages, { role: 'assistant', content: data.reply || data.message || data }]);
    } catch {
      setChatMessages([...newMessages, { role: 'assistant', content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex bg-white border-b border-gray-100 sticky top-0 z-10">
        {[
          { key: 'checkin', label: 'Check-in' },
          { key: 'chat', label: 'Trò chuyện' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              tab === key ? 'text-primary-600' : 'text-gray-400'
            }`}
          >
            {label}
            {tab === key && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {tab === 'checkin' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Chào bạn! Hôm nay bạn thế nào?
            </p>

            <form onSubmit={handleCheckin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ ngủ đêm qua
                </label>
                <input
                  type="number"
                  value={checkinForm.sleepHours}
                  onChange={(e) => handleCheckinChange('sleepHours', e.target.value)}
                  min="0"
                  max="24"
                  step="0.5"
                  placeholder="Ví dụ: 7.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mức căng thẳng: {checkinForm.stressLevel}/10
                </label>
                <input
                  type="range"
                  value={checkinForm.stressLevel}
                  onChange={(e) => handleCheckinChange('stressLevel', Number(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 - Thoải mái</span>
                  <span>10 - Rất căng</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tâm trạng</label>
                <div className="flex gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => handleCheckinChange('mood', m.value)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        checkinForm.mood === m.value
                          ? 'bg-primary-100 ring-2 ring-primary-500 scale-110'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phút tập thể dục hôm nay
                </label>
                <input
                  type="number"
                  value={checkinForm.exerciseMinutes}
                  onChange={(e) => handleCheckinChange('exerciseMinutes', e.target.value)}
                  min="0"
                  placeholder="Ví dụ: 30"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số ly nước đã uống
                </label>
                <input
                  type="number"
                  value={checkinForm.waterGlasses}
                  onChange={(e) => handleCheckinChange('waterGlasses', e.target.value)}
                  min="0"
                  placeholder="Ví dụ: 6"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={checkinLoading}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                {checkinLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Gửi check-in'
                )}
              </button>
            </form>
          </div>

          {checkinResult && (
            <div className="bg-leaf-50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <span className="font-semibold text-gray-800">AI Coach</span>
              </div>
              <div className="prose prose-sm text-gray-700">
                <ReactMarkdown>
                  {typeof checkinResult === 'string'
                    ? checkinResult
                    : checkinResult.advice || checkinResult.message || JSON.stringify(checkinResult)}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'chat' && (
        <div className="flex-1 flex flex-col">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-1"
          >
            {chatMessages.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-5xl mb-3">🤖</p>
                <p className="font-medium">Trò chuyện với AI Coach</p>
                <p className="text-sm mt-1">Hỏi về sức khỏe, dinh dưỡng, hoặc lời khuyên về trà</p>
              </div>
            )}
            {chatMessages.map((msg, i) =>
              msg.role === 'assistant' ? (
                <AIMessage key={i} message={msg.content} />
              ) : (
                <UserMessage key={i} message={msg.content} />
              )
            )}
            {chatLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-leaf-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSend} className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors flex-shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
