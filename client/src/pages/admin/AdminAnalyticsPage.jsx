import { useEffect, useState } from 'react';
import api from '../../services/api';
import {
    AdminLinkButton,
    AdminPageHeader,
    AdminPanel,
    EmptyState,
    ErrorState,
    LoadingState,
    MetricCard,
    StatusBadge,
} from '../../components/admin/AdminUi';
import { formatCurrency } from '../../components/admin/adminUtils';

const AdminAnalyticsPage = () => {
    const [summary, setSummary] = useState(null);
    const [bestSellers, setBestSellers] = useState([]);
    const [ingredientDemand, setIngredientDemand] = useState([]);
    const [restock, setRestock] = useState({ teaRecommendations: [], ingredientRecommendations: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError('');
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
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải dữ liệu phân tích.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Analytics"
                title="Phân tích bán hàng"
                description="Theo dõi doanh thu, sản phẩm bán chạy, nhu cầu nguyên liệu và gợi ý nhập thêm."
                actions={<AdminLinkButton to="/admin/teas" variant="neutral">Mở catalog</AdminLinkButton>}
                meta={<StatusBadge tone={(summary?.lowStockTeas || 0) > 0 ? 'red' : 'green'}>{summary?.lowStockTeas || 0} cảnh báo tồn thấp</StatusBadge>}
            />

            {error && <ErrorState message={error} onRetry={fetchAnalytics} />}

            {loading ? (
                <LoadingState rows={4} />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard label="Đơn đã thanh toán" value={summary?.totalOrders || 0} caption="Nguồn revenue" tone="green" />
                    <MetricCard label="Doanh thu" value={formatCurrency(summary?.totalRevenue)} caption="Tổng đã paid" tone="purple" />
                    <MetricCard label="Tổng sản phẩm" value={summary?.totalTeas || 0} caption="Trong catalog" tone="blue" />
                    <MetricCard label="Tồn thấp" value={summary?.lowStockTeas || 0} caption="Cần nhập thêm" tone={(summary?.lowStockTeas || 0) > 0 ? 'red' : 'slate'} />
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <AdminPanel title="Top sản phẩm bán chạy" description="Ưu tiên các sản phẩm có doanh thu và số lượng bán cao.">
                    {loading ? (
                        <LoadingState rows={4} />
                    ) : bestSellers.length ? (
                        <div className="divide-y divide-slate-100">
                            {bestSellers.map((item, index) => (
                                <div key={item._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF9DE] text-sm font-black text-[#2F7D14]">{index + 1}</span>
                                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-black text-slate-950">{item.name}</p>
                                        <p className="text-sm text-slate-600">Bán {item.unitsSold} · {formatCurrency(item.revenue)}</p>
                                    </div>
                                    <StatusBadge tone={item.stock <= 10 ? 'red' : 'green'}>Tồn {item.stock}</StatusBadge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="Chưa có dữ liệu bán chạy" description="Dữ liệu xuất hiện khi có đơn đã thanh toán." />
                    )}
                </AdminPanel>

                <AdminPanel title="Nguyên liệu có nhu cầu cao" description="Dựa trên sản phẩm bán chạy và công thức liên quan.">
                    {loading ? (
                        <LoadingState rows={4} />
                    ) : ingredientDemand.length ? (
                        <div className="divide-y divide-slate-100">
                            {ingredientDemand.map((item) => (
                                <div key={item._id} className="py-4 first:pt-0 last:pb-0">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="font-black text-slate-950">{item.name}</p>
                                        <StatusBadge tone="purple">Score {item.demandUnits}</StatusBadge>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.relatedTeaNames?.slice(0, 3).join(', ') || 'Chưa có sản phẩm liên quan'}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="Chưa có nhu cầu nguyên liệu" description="Hệ thống cần thêm dữ liệu bán hàng để tính demand score." />
                    )}
                </AdminPanel>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <AdminPanel title="Gợi ý nhập thêm sản phẩm" description="Danh sách ưu tiên theo số bán và tồn hiện tại.">
                    {(restock.teaRecommendations || []).length ? (
                        <div className="divide-y divide-slate-100">
                            {(restock.teaRecommendations || []).map((item) => (
                                <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                                    <div>
                                        <p className="font-black text-slate-950">{item.name}</p>
                                        <p className="mt-1 text-sm text-slate-600">Đã bán {item.unitsSold} · Tồn {item.stock}</p>
                                    </div>
                                    <StatusBadge tone="yellow">Nhập {item.recommendedRestock}</StatusBadge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="Chưa có đề xuất sản phẩm" description="Không có sản phẩm nào cần nhập thêm theo dữ liệu hiện tại." />
                    )}
                </AdminPanel>

                <AdminPanel title="Gợi ý nhập nguyên liệu" description="Dùng để chuẩn bị nguyên liệu cho các blend bán tốt.">
                    {(restock.ingredientRecommendations || []).length ? (
                        <div className="divide-y divide-slate-100">
                            {(restock.ingredientRecommendations || []).map((item) => (
                                <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                                    <div>
                                        <p className="font-black text-slate-950">{item.name}</p>
                                        <p className="mt-1 text-sm text-slate-600">Giá/gram: {formatCurrency(item.pricePerGram)}</p>
                                    </div>
                                    <StatusBadge tone="purple">Score {item.demandScore}</StatusBadge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="Chưa có đề xuất nguyên liệu" description="Nguyên liệu hiện chưa vượt ngưỡng cần cảnh báo." />
                    )}
                </AdminPanel>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
