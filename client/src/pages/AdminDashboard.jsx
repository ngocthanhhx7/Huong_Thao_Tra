import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [bestSellers, setBestSellers] = useState([]);

    useEffect(() => {
        const fetchOverview = async () => {
            const [overviewRes, analyticsRes, bestRes] = await Promise.all([
                api.get('/admin/overview'),
                api.get('/analytics/dashboard'),
                api.get('/analytics/best-sellers'),
            ]);

            setOverview(overviewRes.data);
            setAnalytics(analyticsRes.data);
            setBestSellers(bestRes.data || []);
        };

        fetchOverview();
    }, []);

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary-600 mb-3">Tổng quan</p>
                <h2 className="text-4xl font-extrabold text-gray-900">Dashboard vận hành</h2>
                <p className="text-gray-500 mt-3">Từ đây bạn có thể đi sâu vào từng module quản lý thay vì gom tất cả trên một trang.</p>
            </div>

            {overview && analytics && (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6"><p className="text-gray-500">Người dùng</p><p className="text-3xl font-extrabold">{overview.totalUsers}</p></div>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6"><p className="text-gray-500">Đơn đã thanh toán</p><p className="text-3xl font-extrabold">{analytics.totalOrders}</p></div>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6"><p className="text-gray-500">Doanh thu</p><p className="text-3xl font-extrabold">{Number(analytics.totalRevenue || 0).toLocaleString('vi-VN')}đ</p></div>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6"><p className="text-gray-500">Sản phẩm tồn thấp</p><p className="text-3xl font-extrabold">{analytics.lowStockTeas}</p></div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
                <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-extrabold text-gray-900">Sản phẩm bán chạy</h3>
                        <Link to="/admin/analytics" className="text-primary-600 font-bold">Xem analytics đầy đủ</Link>
                    </div>
                    <div className="space-y-4">
                        {bestSellers.slice(0, 5).map((item) => (
                            <div key={item._id} className="flex items-center gap-4 rounded-3xl border border-gray-100 p-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover" />
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">Đã bán {item.unitsSold} • Doanh thu {Number(item.revenue).toLocaleString('vi-VN')}đ</p>
                                </div>
                                <span className={`px-3 py-2 rounded-full text-xs font-bold ${item.stock <= 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                                    Tồn {item.stock}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Đi nhanh đến module</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { to: '/admin/orders', label: 'Quản lý đơn hàng' },
                            { to: '/admin/ai-recipes', label: 'Duyệt AI recipes' },
                            { to: '/admin/posts', label: 'Quản lý bài viết' },
                            { to: '/admin/feedback', label: 'Xử lý feedback' },
                            { to: '/admin/analytics', label: 'Phân tích bán hàng' },
                        ].map((item) => (
                            <Link key={item.to} to={item.to} className="rounded-2xl border border-gray-100 px-4 py-4 font-semibold text-gray-700 hover:bg-gray-50">
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
