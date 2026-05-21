import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Feedback = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [form, setForm] = useState({ category: 'website', subject: '', message: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            const { data } = await api.get('/feedback/mine');
            setHistory(data || []);
        };

        fetchHistory();
    }, [user]);

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            await api.post('/feedback', form);
            setForm({ category: 'website', subject: '', message: '' });
            setMessage('Đã gửi feedback thành công.');
            const { data } = await api.get('/feedback/mine');
            setHistory(data || []);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Không thể gửi feedback.');
        }
    };

    if (!user) return <div className="text-center py-24 text-gray-500">Vui lòng đăng nhập để gửi feedback.</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={submitFeedback} className="bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Gửi feedback</h1>
                {message && <div className="bg-primary-50 text-primary-700 px-4 py-3 rounded-2xl">{message}</div>}
                <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200">
                    <option value="website">Website</option>
                    <option value="service">Dịch vụ</option>
                    <option value="order">Đơn hàng</option>
                    <option value="ai">Tính năng AI</option>
                    <option value="other">Khác</option>
                </select>
                <input value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} required placeholder="Chủ đề feedback" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <textarea value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} required rows="6" placeholder="Nội dung phản hồi" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-2xl font-bold">Gửi feedback</button>
            </form>

            <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Lịch sử phản hồi</h2>
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item._id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            <div className="flex justify-between gap-3 mb-2">
                                <p className="font-bold text-gray-900">{item.subject}</p>
                                <span className="text-xs font-bold uppercase text-primary-600">{item.status}</span>
                            </div>
                            <p className="text-sm text-gray-600">{item.message}</p>
                            {item.adminReply && <p className="text-sm text-primary-700 mt-3"><strong>Phản hồi:</strong> {item.adminReply}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
