import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Cart = () => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const mapCartItems = (items = []) =>
        items.map((item) => ({
            id: item._id,
            teaId: item.tea,
            name: item.name,
            price: item.price,
            quantity: item.qty,
            image: item.image,
        }));

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setCartItems([]);
                setErrorMessage('');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setErrorMessage('');
                const { data } = await api.get('/cart');
                setCartItems(mapCartItems(data.items));
            } catch (error) {
                console.error('Lỗi khi lấy giỏ hàng', error);
                setErrorMessage('Không thể tải giỏ hàng lúc này.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    const updateQuantity = async (id, newQuantity) => {
        try {
            setErrorMessage('');
            const { data } = await api.put(`/cart/${id}`, { qty: newQuantity });
            setCartItems(mapCartItems(data.items));
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng', error);
            setErrorMessage('Không thể cập nhật số lượng sản phẩm.');
        }
    };

    const removeItem = async (id) => {
        try {
            setErrorMessage('');
            const { data } = await api.delete(`/cart/${id}`);
            setCartItems(mapCartItems(data.items));
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm', error);
            setErrorMessage('Không thể xóa sản phẩm khỏi giỏ hàng.');
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Giỏ hàng của bạn</h1>
                    <p className="text-gray-500 text-lg">Xem và quản lý các sản phẩm bạn đã chọn</p>
                </div>

                {!user ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[320px]">
                        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 14a9 9 0 10-18 0h18z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Vui lòng đăng nhập</h3>
                        <p className="text-gray-500 mb-8 max-w-sm">Đăng nhập để xem và quản lý giỏ hàng của bạn.</p>
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

                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h3>
                                <p className="text-gray-500 mb-8 max-w-sm">Có vẻ như bạn chưa thêm sản phẩm nào. Hãy khám phá thực đơn trà phong phú của chúng tôi!</p>
                                <a href="/teas" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300">
                                    Khám phá ngay
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-5">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)]">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                                <div className="relative">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-24 h-24 object-cover rounded-2xl bg-gray-100"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-2">{item.name}</h3>
                                                    <p className="text-primary-600 font-extrabold text-lg">{item.price.toLocaleString()}đ</p>
                                                </div>
                                                <div className="flex items-center gap-5 justify-between sm:justify-start mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                                                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm transition-all"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-gray-800 hover:shadow-sm transition-all"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="w-10 h-10 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100 lg:sticky lg:top-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between text-gray-500 font-medium">
                                                <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                                                <span className="text-gray-900">{totalPrice.toLocaleString()}đ</span>
                                            </div>
                                            <div className="flex justify-between text-gray-500 font-medium">
                                                <span>Phí vận chuyển</span>
                                                <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded text-sm font-bold">Miễn phí</span>
                                            </div>
                                            <div className="h-px bg-gray-100 my-4" />
                                            <div className="flex justify-between items-end">
                                                <span className="text-gray-500 font-medium mb-1">Tổng cộng</span>
                                                <span className="text-3xl font-extrabold text-primary-600">{totalPrice.toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold hover:shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all duration-300">
                                            Thanh toán ngay
                                        </button>
                                        <div className="flex items-center justify-center gap-2 mt-5 text-gray-400 text-xs font-medium">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            Thanh toán an toàn 100%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
