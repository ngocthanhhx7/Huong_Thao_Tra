import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const AIHistory = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/ai/history');
                setHistory(data);
            } catch (error) {
                console.error('Lỗi khi lấy lịch sử AI', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const filteredHistory = history.filter((item) => item.type === 'MixTea');

    if (loading) {
        return <div className="text-center py-24 text-gray-500">Đang tải lịch sử AI...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử AI</h1>
                    <p className="text-gray-600">Theo dõi công thức AI, trạng thái lưu và luồng duyệt lên cửa hàng.</p>
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch sử</h3>
                        <p className="text-gray-600">Bắt đầu tạo công thức trà đầu tiên của bạn!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHistory.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-start justify-between mb-4 gap-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        AI Pha Trà
                                    </span>
                                    <span className="text-xs font-bold uppercase text-primary-600">{item.lifecycleStatus || 'draft'}</span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.result?.teaName || 'Công thức trà'}</h3>
                                <p className="text-sm text-gray-600 mb-3">{item.result?.useCase}</p>
                                <p className="text-sm text-gray-600 mb-2"><strong>Mục tiêu:</strong> {item.inputParams?.goal ?? 'N/A'}</p>
                                <p className="text-sm text-gray-600 mb-2"><strong>Hương vị:</strong> {item.inputParams?.flavorPreference ?? 'N/A'}</p>
                                <p className="text-sm text-gray-600"><strong>Lợi ích:</strong> {Array.isArray(item.result?.benefits) ? item.result.benefits.join(', ') : 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIHistory;
