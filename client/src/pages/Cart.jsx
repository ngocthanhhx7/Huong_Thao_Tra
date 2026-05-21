import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
            name: item.name,
            price: item.price,
            quantity: item.qty,
            image: item.image,
        }));

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setCartItems([]);
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get('/cart');
                setCartItems(mapCartItems(data.items));
            } catch (error) {
                console.error(error);
                setErrorMessage('Không thể tải giỏ hàng lúc này.');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    const updateQuantity = async (id, newQuantity) => {
        try {
            const { data } = await api.put(`/cart/${id}`, { qty: newQuantity });
            setCartItems(mapCartItems(data.items));
        } catch (error) {
            console.error(error);
            setErrorMessage('Không thể cập nhật số lượng sản phẩm.');
        }
    };

    const removeItem = async (id) => {
        try {
            const { data } = await api.delete(`/cart/${id}`);
            setCartItems(mapCartItems(data.items));
        } catch (error) {
            console.error(error);
            setErrorMessage('Không thể xóa sản phẩm khỏi giỏ hàng.');
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal > 500000 ? 0 : 30000;

    if (loading) {
        return <div className="text-center py-24 text-gray-500">Đang tải giỏ hàng...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Giỏ hàng của bạn</h1>
                    <p className="text-gray-500 text-lg">Xem và quản lý các sản phẩm bạn đã chọn</p>
                </div>

                {!user ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Vui lòng đăng nhập</h3>
                        <p className="text-gray-500 mb-8">Đăng nhập để xem và thanh toán giỏ hàng của bạn.</p>
                        <Link to="/login" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3.5 rounded-xl font-bold">
                            Đi đến đăng nhập
                        </Link>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h3>
                        <p className="text-gray-500 mb-8">Hãy thêm vài sản phẩm trước khi checkout.</p>
                        <Link to="/teas" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3.5 rounded-xl font-bold">
                            Khám phá ngay
                        </Link>
                    </div>
                ) : (
                    <>
                        {errorMessage && <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl">{errorMessage}</div>}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-5">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl bg-gray-100" />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{item.name}</h3>
                                                <p className="text-primary-600 font-extrabold text-lg">{item.price.toLocaleString()}đ</p>
                                            </div>
                                            <div className="flex items-center gap-5 justify-between">
                                                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8">-</button>
                                                    <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8">+</button>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="w-10 h-10 text-red-400 hover:text-red-600 rounded-xl transition-colors">
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-3xl p-7 border border-gray-100 lg:sticky lg:top-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-gray-500 font-medium">
                                            <span>Tạm tính</span>
                                            <span className="text-gray-900">{subtotal.toLocaleString()}đ</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500 font-medium">
                                            <span>Phí vận chuyển</span>
                                            <span className="text-primary-600">{shipping.toLocaleString()}đ</span>
                                        </div>
                                        <div className="h-px bg-gray-100 my-4" />
                                        <div className="flex justify-between items-end">
                                            <span className="text-gray-500 font-medium mb-1">Tổng cộng</span>
                                            <span className="text-3xl font-extrabold text-primary-600">{(subtotal + shipping).toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                    <Link to="/checkout" className="block text-center w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold">
                                        Tiến hành thanh toán
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
