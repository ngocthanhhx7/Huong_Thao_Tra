import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import OrderRecipeSnapshot from '../../components/OrderRecipeSnapshot';
import {
    AdminPageHeader,
    AdminPanel,
    ErrorState,
    FormField,
    LoadingState,
    StatusBadge,
} from '../../components/admin/AdminUi';
import { adminSelectClass, formatCurrency, formatDateTime } from '../../components/admin/adminUtils';

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

const AdminOrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải chi tiết đơn hàng.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const updateStatus = async (status) => {
        try {
            setUpdating(true);
            await api.patch(`/admin/orders/${id}/status`, { status, note: 'Updated from order detail' });
            await fetchOrder();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <LoadingState rows={5} />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchOrder} />;
    }

    if (!order) {
        return null;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Order detail"
                title={`Đơn hàng ${order._id}`}
                description="Xem sản phẩm, thông tin giao hàng và tỷ lệ nguyên liệu AI Mix để đóng hàng đúng công thức."
                meta={
                    <>
                        <StatusBadge tone={statusTones[order.orderStatus] || 'slate'}>{statusLabels[order.orderStatus] || order.orderStatus}</StatusBadge>
                        <StatusBadge tone={order.isPaid ? 'green' : 'yellow'}>{order.isPaid ? 'Paid' : 'Unpaid'}</StatusBadge>
                    </>
                }
                actions={<Link to="/admin/orders" className="admin-btn admin-btn-neutral">Quay lại</Link>}
            />

            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                <AdminPanel title="Sản phẩm trong đơn" description="AI Mix sẽ hiển thị rõ tỷ lệ và lượng nguyên liệu ngay dưới sản phẩm.">
                    <div className="space-y-4">
                        {(order.orderItems || []).map((item, index) => (
                            <div key={`${item.tea}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="font-black text-slate-950">{item.name}</p>
                                        <p className="mt-1 text-sm text-slate-500">Số lượng: {item.qty}</p>
                                    </div>
                                    <p className="font-black text-slate-950">{formatCurrency(Number(item.price) * Number(item.qty))}</p>
                                </div>
                                <OrderRecipeSnapshot item={item} compact />
                            </div>
                        ))}
                    </div>
                </AdminPanel>

                <div className="space-y-6">
                    <AdminPanel title="Cập nhật trạng thái">
                        <FormField label="Trạng thái hiện tại">
                            <select
                                value={order.orderStatus}
                                onChange={(event) => updateStatus(event.target.value)}
                                disabled={updating}
                                className={adminSelectClass}
                            >
                                {ORDER_STATUSES.map((status) => (
                                    <option key={status} value={status}>{statusLabels[status]}</option>
                                ))}
                            </select>
                        </FormField>
                    </AdminPanel>

                    <AdminPanel title="Thông tin giao hàng">
                        <div className="space-y-2 text-sm text-slate-700">
                            <p><span className="font-black text-slate-500">Khách:</span> {order.user?.name || order.shippingAddress?.receiverName}</p>
                            <p><span className="font-black text-slate-500">Email:</span> {order.user?.email || 'Chưa có'}</p>
                            <p><span className="font-black text-slate-500">SĐT:</span> {order.shippingAddress?.receiverPhone || 'Chưa có'}</p>
                            <p><span className="font-black text-slate-500">Địa chỉ:</span> {[order.shippingAddress?.address, order.shippingAddress?.ward, order.shippingAddress?.district, order.shippingAddress?.city].filter(Boolean).join(', ')}</p>
                            {order.shippingAddress?.note && <p><span className="font-black text-slate-500">Ghi chú:</span> {order.shippingAddress.note}</p>}
                        </div>
                    </AdminPanel>

                    <AdminPanel title="Thanh toán">
                        <div className="space-y-2 text-sm text-slate-700">
                            <p><span className="font-black text-slate-500">Phương thức:</span> {order.paymentMethod}</p>
                            <p><span className="font-black text-slate-500">Tạm tính + thuế + ship:</span> {formatCurrency(order.totalPrice)}</p>
                            <p><span className="font-black text-slate-500">Ngày tạo:</span> {formatDateTime(order.createdAt)}</p>
                        </div>
                    </AdminPanel>
                </div>
            </div>

            <AdminPanel title="Timeline trạng thái">
                <div className="space-y-3">
                    {(order.statusHistory || []).map((entry, index) => (
                        <div key={`${entry.status}-${index}`} className="border-l-4 border-primary-200 pl-4">
                            <p className="font-black text-slate-950">{statusLabels[entry.status] || entry.status}</p>
                            <p className="text-sm text-slate-500">{formatDateTime(entry.changedAt)}</p>
                            {entry.note && <p className="mt-1 text-sm text-slate-600">{entry.note}</p>}
                        </div>
                    ))}
                </div>
            </AdminPanel>
        </div>
    );
};

export default AdminOrderDetailPage;
