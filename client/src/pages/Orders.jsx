import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered'];

const statusTextMap = {
    Pending: 'Chờ xác nhận',
    Confirmed: 'Đã xác nhận',
    Processing: 'Đang chuẩn bị',
    Shipping: 'Đang giao',
    Delivered: 'Giao thành công',
};

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get('/orders/mine');
                setOrders(data || []);
            } catch (error) {
                console.error(error);
                setErrorMessage('Không thể tải lịch sử đơn hàng lúc này.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) return <div className="text-center py-24 text-gray-500">Đang tải đơn hàng...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Lịch sử đơn hàng</h1>
                    <p className="text-gray-500 text-lg">Theo dõi tiến trình xử lý và giao hàng của bạn</p>
                </div>

                {!user ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Vui lòng đăng nhập</h3>
                        <Link to="/login" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3.5 rounded-xl font-bold">
                            Đi đến đăng nhập
                        </Link>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có đơn hàng</h3>
                        <Link to="/teas" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3.5 rounded-xl font-bold">
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <>
                        {errorMessage && <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl">{errorMessage}</div>}
                        <div className="space-y-6">
                            {orders.map((order) => {
                                const currentIndex = STATUS_STEPS.indexOf(order.orderStatus || 'Pending');
                                return (
                                    <div key={order._id} className="bg-white rounded-3xl border border-gray-100 p-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-100/80">
                                            <div>
                                                <h3 className="text-xl font-extrabold text-gray-900">Đơn hàng {order._id}</h3>
                                                <p className="text-sm font-medium text-gray-400">
                                                    Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            <div className="mt-4 md:mt-0 text-left md:text-right">
                                                <p className="text-sm text-gray-500 mb-0.5">Tổng thanh toán</p>
                                                <span className="text-2xl font-extrabold text-primary-600">{Number(order.totalPrice).toLocaleString()}đ</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                                            {STATUS_STEPS.map((status, index) => (
                                                <div
                                                    key={status}
                                                    className={`rounded-2xl border p-3 text-center ${index <= currentIndex ? 'bg-primary-50 border-primary-100 text-primary-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                                >
                                                    <div className="text-xs font-extrabold uppercase tracking-wider">{statusTextMap[status]}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            {(order.orderItems || []).map((item, index) => (
                                                <div key={index} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-500 font-medium">Số lượng: <span className="text-gray-700">{item.qty}</span></p>
                                                    </div>
                                                    <span className="text-gray-900 font-bold">{(item.price * item.qty).toLocaleString()}đ</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 flex flex-wrap gap-3">
                                            <Link to={`/orders/${order._id}`} className="bg-primary-50 text-primary-700 px-6 py-2.5 rounded-xl text-sm font-bold border border-primary-100">
                                                Xem chi tiết
                                            </Link>
                                            <Link to="/feedback" className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm">
                                                Gửi feedback
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Orders;
