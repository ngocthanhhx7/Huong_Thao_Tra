import { useEffect, useState } from 'react';
import api from '../../services/api';
import {
    AdminButton,
    AdminPageHeader,
    AdminPanel,
    EmptyState,
    ErrorState,
    FormField,
    LoadingState,
    MetricCard,
    StatusBadge,
} from '../../components/admin/AdminUi';
import {
    adminInputClass,
    adminSelectClass,
    formatCurrency,
    formatDateTime,
} from '../../components/admin/adminUtils';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered'];

const statusLabels = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Processing: 'Đang chuẩn bị',
    Shipping: 'Đang giao',
    Delivered: 'Đã giao',
};

const statusTones = {
    Pending: 'yellow',
    Confirmed: 'blue',
    Processing: 'teal',
    Shipping: 'green',
    Delivered: 'slate',
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/admin/orders');
            setOrders(data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            await api.patch(`/admin/orders/${id}/status`, { status, note: 'Updated from orders module' });
            await fetchOrders();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng.');
        } finally {
            setUpdatingId('');
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        const keyword = search.trim().toLowerCase();
        const matchesSearch =
            !keyword ||
            order._id?.toLowerCase().includes(keyword) ||
            order.user?.name?.toLowerCase().includes(keyword) ||
            order.user?.email?.toLowerCase().includes(keyword);

        return matchesStatus && matchesSearch;
    });

    const paidCount = orders.filter((order) => order.isPaid).length;
    const pendingCount = orders.filter((order) => order.orderStatus === 'Pending').length;
    const revenue = orders.reduce((sum, order) => sum + (order.isPaid ? Number(order.totalPrice || 0) : 0), 0);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Orders"
                title="Quản lý đơn hàng"
                description="Lọc nhanh theo trạng thái, kiểm tra thanh toán và cập nhật tiến trình giao hàng trong cùng một màn hình."
                meta={
                    <>
                        <StatusBadge tone="yellow">{pendingCount} chờ xử lý</StatusBadge>
                        <StatusBadge tone="green">{paidCount} đã thanh toán</StatusBadge>
                    </>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchOrders} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard label="Tổng đơn" value={orders.length} caption="Tất cả trạng thái" tone="green" />
                <MetricCard label="Đã thanh toán" value={paidCount} caption={formatCurrency(revenue)} tone="teal" />
                <MetricCard label="Chờ xác nhận" value={pendingCount} caption="Cần ưu tiên xử lý" tone={pendingCount > 0 ? 'yellow' : 'slate'} />
            </div>

            <AdminPanel
                title="Danh sách đơn hàng"
                description="Tìm theo mã đơn, tên hoặc email khách hàng."
                actions={
                    <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-[220px_180px]">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm đơn hàng" className={adminInputClass} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={adminSelectClass}>
                            <option value="all">Tất cả trạng thái</option>
                            {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>{statusLabels[status]}</option>
                            ))}
                        </select>
                    </div>
                }
            >
                {loading ? (
                    <LoadingState rows={5} />
                ) : filteredOrders.length ? (
                    <div className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="grid gap-4 py-4 first:pt-0 last:pb-0 xl:grid-cols-[1.2fr_0.9fr_220px] xl:items-center">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-black text-slate-950">{order.user?.name || 'Khách hàng'}</p>
                                        <StatusBadge tone={statusTones[order.orderStatus] || 'slate'}>{statusLabels[order.orderStatus] || order.orderStatus}</StatusBadge>
                                        <StatusBadge tone={order.isPaid ? 'green' : 'yellow'}>{order.isPaid ? 'Paid' : 'Unpaid'}</StatusBadge>
                                    </div>
                                    <p className="mt-1 break-all text-sm text-slate-500">{order._id}</p>
                                    <p className="mt-1 text-sm text-slate-600">{formatDateTime(order.createdAt)}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="font-black text-slate-500">Tổng tiền</p>
                                        <p className="mt-1 font-black text-slate-950">{formatCurrency(order.totalPrice)}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="font-black text-slate-500">Số món</p>
                                        <p className="mt-1 font-black text-slate-950">{order.orderItems?.length || 0}</p>
                                    </div>
                                </div>

                                <FormField label="Cập nhật trạng thái">
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        disabled={updatingId === order._id}
                                        className={adminSelectClass}
                                    >
                                        {ORDER_STATUSES.map((status) => (
                                            <option key={status} value={status}>{statusLabels[status]}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Không có đơn phù hợp"
                        description="Thử đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm."
                        action={<AdminButton variant="neutral" onClick={() => { setStatusFilter('all'); setSearch(''); }}>Xóa bộ lọc</AdminButton>}
                    />
                )}
            </AdminPanel>
        </div>
    );
};

export default AdminOrdersPage;
