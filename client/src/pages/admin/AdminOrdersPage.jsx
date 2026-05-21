import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const { data } = await api.get('/admin/orders');
        setOrders(data || []);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        await api.patch(`/admin/orders/${id}/status`, { status, note: 'Updated from orders module' });
        fetchOrders();
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Quản lý đơn hàng</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order._id} className="rounded-3xl border border-gray-100 p-5">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <p className="font-bold text-gray-900">{order.user?.name || 'Khách hàng'}</p>
                                <p className="text-sm text-gray-500">{order._id}</p>
                                <p className="text-sm text-gray-500 mt-1">Tổng tiền: {Number(order.totalPrice || 0).toLocaleString('vi-VN')}đ</p>
                            </div>
                            <select value={order.orderStatus} onChange={(e) => updateStatus(order._id, e.target.value)} className="px-4 py-3 rounded-2xl border border-gray-200">
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipping">Shipping</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
