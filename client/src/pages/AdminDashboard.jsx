import { useEffect, useState } from 'react';
import api from '../services/api';
import {
    AdminLinkButton,
    AdminPageHeader,
    AdminPanel,
    EmptyState,
    ErrorState,
    LoadingState,
    MetricCard,
    StatusBadge,
} from '../components/admin/AdminUi';
import { formatCurrency } from '../components/admin/adminUtils';

const AdminDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOverview = async () => {
        try {
            setLoading(true);
            setError('');
            const [overviewRes, analyticsRes, bestRes] = await Promise.all([
                api.get('/admin/overview'),
                api.get('/analytics/dashboard'),
                api.get('/analytics/best-sellers'),
            ]);

            setOverview(overviewRes.data);
            setAnalytics(analyticsRes.data);
            setBestSellers(bestRes.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Vui lòng kiểm tra quyền admin/staff hoặc kết nối API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverview();
    }, []);

    const quickLinks = [
        { to: '/admin/orders', label: 'Xử lý đơn hàng', note: 'Cập nhật trạng thái vận chuyển', tone: 'green' },
        { to: '/admin/ai-recipes', label: 'Duyệt công thức AI', note: 'Định giá và xuất bản blend', tone: 'purple' },
        { to: '/admin/posts', label: 'Quản lý bài viết', note: 'Soạn nội dung cho cộng đồng', tone: 'blue' },
        { to: '/admin/feedback', label: 'Xử lý feedback', note: 'Trả lời và đóng yêu cầu', tone: 'yellow' },
        { to: '/admin/analytics', label: 'Xem phân tích', note: 'Doanh thu, top bán chạy, tồn kho', tone: 'slate' },
    ];

    return (
        <div className="admin-page space-y-6">
            <AdminPageHeader
                eyebrow="Tổng quan"
                title="Dashboard vận hành"
                description="Theo dõi nhanh doanh thu, tồn kho, công thức AI và các module cần xử lý trong ngày."
                actions={<AdminLinkButton to="/admin/orders">Mở đơn hàng</AdminLinkButton>}
                meta={
                    <>
                        <StatusBadge tone="green">Live API</StatusBadge>
                        {overview?.role && <StatusBadge tone="purple">{overview.role}</StatusBadge>}
                    </>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchOverview} />}

            {loading ? (
                <LoadingState rows={4} />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard label="Người dùng" value={overview?.totalUsers || 0} caption={`${overview?.totalTeas || 0} sản phẩm đang quản lý`} tone="green" />
                    <MetricCard label="Đơn đã thanh toán" value={analytics?.totalOrders || 0} caption="Chỉ tính đơn đã paid" tone="purple" />
                    <MetricCard label="Doanh thu" value={formatCurrency(analytics?.totalRevenue)} caption="Theo dữ liệu thanh toán" tone="yellow" />
                    <MetricCard label="Tồn kho thấp" value={analytics?.lowStockTeas || 0} caption={`${overview?.totalAITeas || 0} công thức AI`} tone={(analytics?.lowStockTeas || 0) > 0 ? 'red' : 'blue'} />
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <AdminPanel
                    title="Sản phẩm bán chạy"
                    description="Top sản phẩm theo đơn đã thanh toán để ưu tiên tồn kho."
                    actions={<AdminLinkButton to="/admin/analytics" variant="neutral">Xem đầy đủ</AdminLinkButton>}
                >
                    <div className="divide-y divide-slate-100">
                        {bestSellers.slice(0, 5).map((item) => (
                            <div key={item._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-black text-slate-950">{item.name}</p>
                                    <p className="text-sm text-slate-600">Đã bán {item.unitsSold} · {formatCurrency(item.revenue)}</p>
                                </div>
                                <StatusBadge tone={item.stock <= 10 ? 'red' : 'green'}>Tồn {item.stock}</StatusBadge>
                            </div>
                        ))}
                        {!bestSellers.length && !loading && (
                            <EmptyState title="Chưa có sản phẩm bán chạy" description="Dữ liệu sẽ xuất hiện khi có đơn hàng đã thanh toán." />
                        )}
                    </div>
                </AdminPanel>

                <AdminPanel title="Đi nhanh đến module" description="Các luồng admin thường dùng được tách rõ để thao tác nhanh.">
                    <div className="space-y-3">
                        {quickLinks.map((item) => (
                            <AdminLinkButton key={item.to} to={item.to} variant={item.tone === 'purple' ? 'secondary' : 'neutral'} className="w-full justify-start">
                                <span className="text-left">
                                    <span className="block">{item.label}</span>
                                    <span className="block text-xs font-bold opacity-75">{item.note}</span>
                                </span>
                            </AdminLinkButton>
                        ))}
                    </div>
                </AdminPanel>
            </div>
        </div>
    );
};

export default AdminDashboard;
