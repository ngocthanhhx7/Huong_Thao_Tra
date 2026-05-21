import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const OrderDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                setErrorMessage(error.response?.data?.message || 'Không thể tải chi tiết đơn hàng.');
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    if (!user) return <div className="text-center py-24 text-gray-500">Vui lòng đăng nhập để xem đơn hàng.</div>;
    if (errorMessage) return <div className="text-center py-24 text-red-500">{errorMessage}</div>;
    if (!order) return <div className="text-center py-24 text-gray-500">Đang tải chi tiết đơn hàng...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-24 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Đơn hàng {order._id}</h1>
                        <p className="text-gray-500 mt-2">Trạng thái hiện tại: <span className="font-bold text-primary-600">{order.orderStatus}</span></p>
                    </div>
                    <Link to="/orders" className="text-primary-600 font-bold">Quay lại lịch sử đơn hàng</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin giao hàng</h2>
                    <p className="text-gray-700">{order.shippingAddress?.address}</p>
                    <p className="text-gray-700">{order.shippingAddress?.city}</p>
                    <p className="text-gray-700">{order.shippingAddress?.postalCode}</p>
                    <p className="text-gray-500 mt-4">Thanh toán: {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline trạng thái</h2>
                    <div className="space-y-4">
                        {(order.statusHistory || []).map((entry, index) => (
                            <div key={index} className="border-l-4 border-primary-200 pl-4">
                                <p className="font-bold text-gray-900">{entry.status}</p>
                                <p className="text-sm text-gray-500">{new Date(entry.changedAt).toLocaleString('vi-VN')}</p>
                                {entry.note && <p className="text-sm text-gray-600 mt-1">{entry.note}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sản phẩm</h2>
                <div className="space-y-4">
                    {(order.orderItems || []).map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                            <div>
                                <p className="font-bold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">Số lượng: {item.qty}</p>
                            </div>
                            <p className="font-bold text-gray-900">{(item.qty * item.price).toLocaleString()}đ</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
