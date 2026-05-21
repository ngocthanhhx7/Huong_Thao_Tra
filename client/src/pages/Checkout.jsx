import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [paymentSession, setPaymentSession] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        paymentMethod: 'VNPay',
    });

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get('/cart');
                setCart(data);
            } catch {
                setErrorMessage('Không thể tải giỏ hàng để checkout.');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [user]);

    const subtotal = useMemo(() => (cart?.items || []).reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
    const shipping = subtotal > 500000 ? 0 : 30000;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErrorMessage('');
        try {
            const { data: order } = await api.post('/orders/from-cart', {
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                },
                paymentMethod: formData.paymentMethod,
            });
            const { data: session } = await api.post('/payments/demo/session', { orderId: order._id });
            setPaymentSession({ ...session, orderId: order._id });
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Không thể tạo phiên checkout.');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmPayment = async (result) => {
        try {
            await api.post('/payments/demo/confirm', {
                paymentId: paymentSession.paymentId,
                result,
            });
            navigate(`/orders/${paymentSession.orderId}`);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Không thể xác nhận thanh toán demo.');
        }
    };

    if (loading) return <div className="text-center py-24 text-gray-500">Đang chuẩn bị checkout...</div>;
    if (!user) return <div className="text-center py-24 text-gray-500">Vui lòng đăng nhập để checkout.</div>;
    if (!cart?.items?.length) return <div className="text-center py-24 text-gray-500">Giỏ hàng đang trống. <Link to="/teas" className="text-primary-600 font-bold">Quay lại cửa hàng</Link></div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-8 space-y-5">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Checkout demo</h1>
                        <p className="text-gray-500 mt-2">Hoàn tất mua hàng và mô phỏng kết quả thanh toán.</p>
                    </div>
                    {errorMessage && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl">{errorMessage}</div>}
                    <input value={formData.address} onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))} required placeholder="Địa chỉ nhận hàng" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                    <input value={formData.city} onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))} required placeholder="Thành phố" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                    <input value={formData.postalCode} onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))} required placeholder="Mã bưu chính" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                    <select value={formData.paymentMethod} onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200">
                        <option value="VNPay">VNPay Demo</option>
                        <option value="Stripe">Stripe Demo</option>
                    </select>
                    <button disabled={submitting || !!paymentSession} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-2xl font-bold">
                        {submitting ? 'Đang tạo đơn hàng...' : 'Tạo đơn hàng & mở thanh toán demo'}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
                        <div className="space-y-4">
                            {(cart.items || []).map((item) => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.qty}</span>
                                    <span>{(item.price * item.qty).toLocaleString()}đ</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
                            <div className="flex justify-between"><span>Tạm tính</span><span>{subtotal.toLocaleString()}đ</span></div>
                            <div className="flex justify-between"><span>Thuế</span><span>{tax.toLocaleString()}đ</span></div>
                            <div className="flex justify-between"><span>Vận chuyển</span><span>{shipping.toLocaleString()}đ</span></div>
                            <div className="flex justify-between text-xl font-extrabold text-primary-600"><span>Tổng</span><span>{total.toLocaleString()}đ</span></div>
                        </div>
                    </div>

                    {paymentSession && (
                        <div className="bg-white rounded-3xl border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Mô phỏng kết quả thanh toán</h2>
                            <p className="text-gray-500 mb-6">Transaction ID: <span className="font-bold text-gray-900">{paymentSession.transactionId}</span></p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button type="button" onClick={() => confirmPayment('success')} className="py-3 rounded-2xl bg-green-600 text-white font-bold">Thành công</button>
                                <button type="button" onClick={() => confirmPayment('failed')} className="py-3 rounded-2xl bg-red-500 text-white font-bold">Thất bại</button>
                                <button type="button" onClick={() => confirmPayment('cancelled')} className="py-3 rounded-2xl bg-gray-800 text-white font-bold">Hủy</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
