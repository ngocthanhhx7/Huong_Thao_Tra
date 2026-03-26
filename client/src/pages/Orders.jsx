import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setOrders([]);
                setErrorMessage('');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setErrorMessage('');
                const { data } = await api.get('/orders/mine');
                const mappedOrders = (data || []).map((order) => ({
                    id: order._id,
                    date: order.createdAt,
                    status: order.isDelivered ? 'delivered' : order.isPaid ? 'shipped' : 'pending',
                    total: order.totalPrice,
                    items: (order.orderItems || []).map((item) => ({
                        name: item.name,
                        quantity: item.qty,
                        price: item.price,
                    })),
                }));

                setOrders(mappedOrders);
            } catch (error) {
                console.error('Lỗi khi lấy đơn hàng', error);
                setErrorMessage('Không thể tải lịch sử đơn hàng lúc này.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang xử lý';
            case 'shipped': return 'Đã giao';
            case 'delivered': return 'Đã nhận';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Lịch sử đơn hàng</h1>
                    <p className="text-gray-500 text-lg">Theo dõi và quản lý các giao dịch của bạn</p>
                </div>

                {!user ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[320px]">
                        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Vui lòng đăng nhập</h3>
                        <p className="text-gray-500 mb-8 max-w-sm">Đăng nhập để xem lịch sử đơn hàng của bạn.</p>
                        <a href="/login" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300">
                            Đi đến đăng nhập
                        </a>
                    </div>
                ) : (
                    <>
                        {errorMessage && (
                            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl">
                                {errorMessage}
                            </div>
                        )}

                        {orders.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có đơn hàng</h3>
                                <p className="text-gray-500 mb-8 max-w-sm">Bắt đầu mua sắm để theo dõi lịch sử và các liệu trình sức khỏe của bạn.</p>
                                <a href="/teas" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300">
                                    Mua sắm ngay
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] border border-gray-100 p-8 transition-all duration-300">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-100/80">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-extrabold text-gray-900">Đơn hàng {order.id}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)} border border-white/50 shadow-sm`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-400">Đặt ngày {formatDate(order.date)}</p>
                                            </div>
                                            <div className="mt-4 md:mt-0 text-left md:text-right">
                                                <p className="text-sm text-gray-500 mb-0.5">Tổng thanh toán</p>
                                                <span className="text-2xl font-extrabold text-primary-600">{order.total.toLocaleString()}đ</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Danh sách sản phẩm</h4>
                                            <div className="space-y-4">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                                                        <div className="flex-1">
                                                            <p className="font-bold text-gray-900">{item.name}</p>
                                                            <p className="text-sm text-gray-500 font-medium">Số lượng: <span className="text-gray-700">{item.quantity}</span></p>
                                                        </div>
                                                        <span className="text-gray-900 font-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-wrap gap-3">
                                            <button className="bg-primary-50 text-primary-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-600 hover:text-white transition-colors border border-primary-100 hover:border-transparent">
                                                Xem chi tiết
                                            </button>
                                            <button className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm cursor-pointer">
                                                Mua lại
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Orders;
