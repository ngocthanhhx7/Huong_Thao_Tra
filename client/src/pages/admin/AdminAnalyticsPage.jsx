import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminAnalyticsPage = () => {
    const [summary, setSummary] = useState(null);
    const [bestSellers, setBestSellers] = useState([]);
    const [ingredientDemand, setIngredientDemand] = useState([]);
    const [restock, setRestock] = useState({ teaRecommendations: [], ingredientRecommendations: [] });

    useEffect(() => {
        const fetchAnalytics = async () => {
            const [summaryRes, bestRes, ingredientRes, restockRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/best-sellers'),
                api.get('/analytics/ingredient-demand'),
                api.get('/analytics/restock-recommendations'),
            ]);

            setSummary(summaryRes.data);
            setBestSellers(bestRes.data || []);
            setIngredientDemand(ingredientRes.data || []);
            setRestock(restockRes.data || { teaRecommendations: [], ingredientRecommendations: [] });
        };

        fetchAnalytics();
    }, []);

    return (
        <div className="space-y-8">
            {summary && (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6"><p className="text-gray-500">Đơn đã thanh toán</p><p className="text-3xl font-extrabold">{summary.totalOrders}</p></div>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6"><p className="text-gray-500">Doanh thu</p><p className="text-3xl font-extrabold">{Number(summary.totalRevenue || 0).toLocaleString('vi-VN')}đ</p></div>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6"><p className="text-gray-500">Tổng sản phẩm</p><p className="text-3xl font-extrabold">{summary.totalTeas}</p></div>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6"><p className="text-gray-500">Cảnh báo tồn thấp</p><p className="text-3xl font-extrabold">{summary.lowStockTeas}</p></div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Top sản phẩm bán chạy</h2>
                    <div className="space-y-4">
                        {bestSellers.map((item) => (
                            <div key={item._id} className="rounded-3xl border border-gray-100 p-4 flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover" />
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">Bán {item.unitsSold} • {Number(item.revenue).toLocaleString('vi-VN')}đ</p>
                                </div>
                                <span className={`px-3 py-2 rounded-full text-xs font-bold ${item.stock <= 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                                    Tồn {item.stock}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Nguyên liệu có nhu cầu cao</h2>
                    <div className="space-y-4">
                        {ingredientDemand.map((item) => (
                            <div key={item._id} className="rounded-3xl border border-gray-100 p-4">
                                <p className="font-bold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500 mt-1">Demand score: {item.demandUnits} • {item.relatedTeaNames.slice(0, 3).join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Gợi ý nhập thêm sản phẩm</h2>
                    <div className="space-y-4">
                        {(restock.teaRecommendations || []).map((item) => (
                            <div key={item._id} className="rounded-3xl border border-gray-100 p-4">
                                <p className="font-bold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500 mt-1">Đã bán {item.unitsSold} • Tồn {item.stock} • Gợi ý nhập {item.recommendedRestock}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Gợi ý nhập nguyên liệu</h2>
                    <div className="space-y-4">
                        {(restock.ingredientRecommendations || []).map((item) => (
                            <div key={item._id} className="rounded-3xl border border-gray-100 p-4">
                                <p className="font-bold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500 mt-1">Demand score: {item.demandScore} • Giá/gram: {item.pricePerGram}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
