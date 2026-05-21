import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminFeedbackPage = () => {
    const [feedback, setFeedback] = useState([]);

    const fetchFeedback = async () => {
        const { data } = await api.get('/admin/feedback');
        setFeedback(data || []);
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const updateFeedback = async (id, status) => {
        await api.patch(`/admin/feedback/${id}`, { status, adminReply: `Cập nhật trạng thái sang ${status}` });
        fetchFeedback();
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Feedback khách hàng</h2>
            <div className="space-y-4">
                {feedback.map((item) => (
                    <div key={item._id} className="rounded-3xl border border-gray-100 p-5">
                        <p className="font-bold text-gray-900">{item.subject}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.user?.name} • {item.category}</p>
                        {item.tea && <p className="text-sm text-primary-600 mt-1">Sản phẩm: {item.tea.name}</p>}
                        <p className="text-gray-600 mt-3">{item.message}</p>
                        <div className="flex gap-2 flex-wrap mt-4">
                            {['new', 'in_review', 'resolved', 'closed'].map((status) => (
                                <button key={status} onClick={() => updateFeedback(item._id, status)} className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm">
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminFeedbackPage;
