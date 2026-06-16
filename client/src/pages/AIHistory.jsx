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
        return <div className="luxury-page"><div className="luxury-container text-center py-28 text-gray-500 font-medium">Đang tải lịch sử AI...</div></div>;
    }

    return (
        <div className="luxury-page py-16 px-4">
            <div className="luxury-container max-w-6xl mx-auto">
                <div className="mb-10 text-center animate-soft-rise">
                    <span className="luxury-kicker">✨ Công thức cá nhân hóa</span>
                    <h1 className="font-display-h1 text-5xl md:text-6xl text-[#27451f] mt-4 mb-3">Lịch sử AI</h1>
                    <p className="text-gray-600">Theo dõi công thức AI, trạng thái lưu và luồng duyệt lên cửa hàng.</p>
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="luxury-card p-12 text-center animate-soft-rise-delay">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch sử</h3>
                        <p className="text-gray-600">Bắt đầu tạo công thức trà đầu tiên của bạn!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHistory.map((item) => (
                            <div key={item._id} className="luxury-card luxury-card-hover p-6 animate-soft-rise-delay">
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
