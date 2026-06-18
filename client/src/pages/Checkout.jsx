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
    const [formData, setFormData] = useState({
        receiverName: '',
        receiverPhone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        note: '',
        postalCode: '100000',
        paymentMethod: 'PayOS',
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
                // Prefill user details if available
                setFormData((prev) => ({
                    ...prev,
                    receiverName: prev.receiverName || user.name || '',
                    receiverPhone: prev.receiverPhone || user.phone || '',
                }));
            } catch {
                setErrorMessage('Không thể tải giỏ hàng để thanh toán.');
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
                    receiverName: formData.receiverName,
                    receiverPhone: formData.receiverPhone,
                    address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    ward: formData.ward,
                    postalCode: formData.postalCode || '100000',
                    note: formData.note,
                },
                paymentMethod: formData.paymentMethod,
            });

            if (formData.paymentMethod === 'PayOS') {
                const { data: payosSession } = await api.post('/payment/payos/create-link', { orderId: order._id });
                window.location.href = payosSession.checkoutUrl;
            } else if (formData.paymentMethod === 'COD') {
                navigate(`/orders/${order._id}`);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-24 text-gray-500 font-medium">Đang chuẩn bị thông tin thanh toán...</div>;
    if (!user) return <div className="text-center py-24 text-gray-500 font-medium">Vui lòng đăng nhập để thực hiện thanh toán.</div>;
    if (!cart?.items?.length) return <div className="text-center py-24 text-gray-500 font-medium">Giỏ hàng của bạn đang trống. <Link to="/teas" className="text-primary-600 font-bold hover:underline">Quay lại cửa hàng</Link></div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Checkout Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-8 space-y-6 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Thông tin giao hàng</h1>
                        <p className="text-gray-500 mt-2">Vui lòng nhập đầy đủ thông tin để Hương Thảo Trà gửi sản phẩm đến tận nơi cho bạn.</p>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium">
                            {errorMessage}
                        </div>
                    )}

                    {/* Receiver Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">1. Người nhận hàng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Họ và tên</label>
                                <input
                                    type="text"
                                    value={formData.receiverName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, receiverName: e.target.value }))}
                                    required
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={formData.receiverPhone}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, receiverPhone: e.target.value }))}
                                    required
                                    placeholder="Ví dụ: 0912345678"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">2. Địa chỉ nhận hàng</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Số nhà, ngõ ngách, tên đường</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                                    required
                                    placeholder="Ví dụ: Số 123, đường Láng"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Phường / Xã</label>
                                    <input
                                        type="text"
                                        value={formData.ward}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, ward: e.target.value }))}
                                        required
                                        placeholder="Ví dụ: Láng Hạ"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Quận / Huyện</label>
                                    <input
                                        type="text"
                                        value={formData.district}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                                        required
                                        placeholder="Ví dụ: Đống Đa"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tỉnh / Thành phố</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                                        required
                                        placeholder="Ví dụ: Hà Nội"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Note */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">3. Ghi chú & Lời nhắn</h3>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ghi chú giao hàng (Tùy chọn)</label>
                            <textarea
                                value={formData.note}
                                onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                                placeholder="Ghi chú về thời gian giao hàng hoặc chỉ dẫn thêm cho shipper..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 resize-none"
                            />
                        </div>
                    </div>

                    {/* Payment Method selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">4. Phương thức thanh toán</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div
                                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'PayOS' }))}
                                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-32 hover:scale-[1.01] active:scale-[0.99] ${
                                    formData.paymentMethod === 'PayOS'
                                        ? 'border-primary-500 bg-primary-50/30'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900">Thanh toán bằng PayOS</span>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                        formData.paymentMethod === 'PayOS'
                                            ? 'border-primary-500 bg-primary-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                        {formData.paymentMethod === 'PayOS' && (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Chuyển khoản QR ngân hàng an toàn cổng PayOS. Xác thực thanh toán tự động ngay tức thì.</p>
                            </div>

                            <div
                                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'COD' }))}
                                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-32 hover:scale-[1.01] active:scale-[0.99] ${
                                    formData.paymentMethod === 'COD'
                                        ? 'border-primary-500 bg-primary-50/30'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900">Thanh toán COD</span>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                        formData.paymentMethod === 'COD'
                                            ? 'border-primary-500 bg-primary-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                        {formData.paymentMethod === 'COD' && (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Thanh toán trực tiếp bằng tiền mặt khi shipper giao trà thảo mộc đến tay bạn.</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-4 rounded-2xl font-bold transition-all shadow-md transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Đang xử lý đơn hàng...
                            </span>
                        ) : formData.paymentMethod === 'PayOS' ? (
                            'Thanh toán ngay qua PayOS'
                        ) : (
                            'Đặt hàng (Thanh toán khi nhận hàng)'
                        )}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {(cart.items || []).map((item) => (
                            <div key={item._id} className="flex gap-4 items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl bg-gray-50 border border-gray-100" />
                                    <div>
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-gray-500 text-xs">Số lượng: {item.qty}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-800">{(item.price * item.qty).toLocaleString()}đ</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 mt-6 pt-6 space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Thuế VAT (10%)</span>
                            <span>{tax.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Phí vận chuyển</span>
                            <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString()}đ`}</span>
                        </div>
                        {shipping > 0 && (
                            <p className="text-[11px] text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                                Mua thêm {(500000 - subtotal).toLocaleString()}đ để được miễn phí vận chuyển.
                            </p>
                        )}
                        <div className="flex justify-between text-lg font-extrabold text-primary-600 pt-2 border-t border-gray-50">
                            <span>Tổng thanh toán</span>
                            <span>{total.toLocaleString()}đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

