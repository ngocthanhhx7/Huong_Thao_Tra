import { useContext, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const OrderDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [paying, setPaying] = useState(false);

    const handlePayNow = async () => {
        setPaying(true);
        setErrorMessage('');
        try {
            const { data } = await api.post('/payment/payos/create-link', { orderId: order._id });
            window.location.href = data.checkoutUrl;
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Không thể khởi tạo thanh toán PayOS.');
        } finally {
            setPaying(false);
        }
    };

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
            {searchParams.get('payment') === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-3xl font-medium flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <p className="font-extrabold text-lg">Thanh toán thành công!</p>
                        <p className="text-sm text-green-600 mt-1">Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được thanh toán và đang chờ nhân viên xác nhận.</p>
                    </div>
                </div>
            )}
            {searchParams.get('payment') === 'cancel' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-6 rounded-3xl font-medium flex items-center gap-3">
                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                        <p className="font-extrabold text-lg">Giao dịch đã bị hủy</p>
                        <p className="text-sm text-amber-600 mt-1">Bạn đã hủy giao dịch thanh toán. Bạn có thể nhấn nút thanh toán lại bên dưới để hoàn tất đơn hàng bất cứ lúc nào.</p>
                    </div>
                </div>
            )}

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
                    <div className="text-gray-500 mt-4 flex items-center gap-3 flex-wrap">
                        <span>Thanh toán: {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                        {!order.isPaid && order.paymentMethod === 'PayOS' && (
                            <button onClick={handlePayNow} disabled={paying} className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-sm">
                                {paying ? 'Đang kết nối...' : 'Thanh toán ngay bằng PayOS'}
                            </button>
                        )}
                    </div>
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
