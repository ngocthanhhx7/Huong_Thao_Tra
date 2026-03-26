import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const AIHistory = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, mix, plan

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

    const filteredHistory = history.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'mix') return item.type === 'MixTea';
        if (filter === 'plan') return item.type === 'HealthPlan';
        return true;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải lịch sử...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử tạo liệu trình AI</h1>
                    <p className="text-gray-600">Xem lại các công thức trà và liệu trình sức khỏe bạn đã tạo</p>
                </div>

                {/* Filter */}
                <div className="mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setFilter('mix')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'mix' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            AI Pha Trà
                        </button>
                        <button
                            onClick={() => setFilter('plan')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'plan' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Liệu Trình AI
                        </button>
                    </div>
                </div>

                {/* History List */}
                {filteredHistory.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch sử</h3>
                        <p className="text-gray-600 mb-6">Bắt đầu tạo công thức trà đầu tiên của bạn!</p>
                        <a href="/ai-mix" className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">
                            Thử AI Pha Trà
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHistory.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'MixTea' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                            {item.type === 'MixTea' ? 'AI Pha Trà' : 'Liệu Trình AI'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                                </div>

                                {item.type === 'MixTea' ? (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.result?.teaName || 'Công thức trà'}</h3>
                                        {item.result?.useCase && <p className="text-sm text-gray-600 mb-2">{item.result.useCase}</p>}
                                        <div className="mb-3">
                                            <p className="text-sm text-gray-600 mb-1"><strong>Mục tiêu:</strong> {item.inputParams?.goal ?? 'N/A'}</p>
                                            <p className="text-sm text-gray-600 mb-1"><strong>Hương vị:</strong> {item.inputParams?.flavorPreference ?? 'N/A'}</p>
                                            <p className="text-sm text-gray-600"><strong>Caffeine:</strong> {item.inputParams?.caffeinePreference ?? 'N/A'}</p>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-900 mb-1">Nguyên liệu:</p>
                                            <p className="text-sm text-gray-600">
                                                {Array.isArray(item.result?.ingredients) ? item.result.ingredients.join(', ') : (item.result?.ingredients || 'N/A')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">Lợi ích:</p>
                                            <p className="text-sm text-gray-600">
                                                {Array.isArray(item.result?.benefits) ? item.result.benefits.join(', ') : (item.result?.benefits || 'N/A')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Liệu trình sức khỏe cá nhân</h3>
                                        <div className="space-y-3">
                                            {item.result?.morningTea && (
                                                <div className="border-l-4 border-yellow-400 pl-3">
                                                    <p className="text-sm font-medium text-gray-900">Sáng: {item.result.morningTea.name}</p>
                                                    <p className="text-xs text-gray-600">{item.result.morningTea.reason}</p>
                                                </div>
                                            )}
                                            {item.result?.afternoonTea && (
                                                <div className="border-l-4 border-orange-400 pl-3">
                                                    <p className="text-sm font-medium text-gray-900">Chiều: {item.result.afternoonTea.name}</p>
                                                    <p className="text-xs text-gray-600">{item.result.afternoonTea.reason}</p>
                                                </div>
                                            )}
                                            {item.result?.nightTea && (
                                                <div className="border-l-4 border-blue-400 pl-3">
                                                    <p className="text-sm font-medium text-gray-900">Tối: {item.result.nightTea.name}</p>
                                                    <p className="text-xs text-gray-600">{item.result.nightTea.reason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIHistory;