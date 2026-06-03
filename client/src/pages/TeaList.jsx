import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const TeaList = () => {
    const [teas, setTeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    useEffect(() => {
        const fetchTeas = async () => {
            try {
                const { data } = await api.get('/teas');
                setTeas(data);
            } catch (error) {
                console.error('Failed to fetch teas', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeas();
    }, []);

    const addToCart = async (teaId) => {
        try {
            await api.post('/cart', { teaId, qty: 1 });
            setFeedbackMessage('Đã thêm sản phẩm vào giỏ hàng.');
        } catch (error) {
            setFeedbackMessage(error.response?.data?.message || 'Vui lòng đăng nhập để thêm vào giỏ hàng.');
        } finally {
            setTimeout(() => setFeedbackMessage(''), 2500);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Đang tải danh sách trà cao cấp...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Bộ Sưu Tập Của Chúng Tôi</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">Khám phá các dòng trà cao cấp và công thức cá nhân hóa được yêu thích nhất.</p>
            </div>

            {feedbackMessage && (
                <div className="max-w-2xl mx-auto mb-8 bg-white border border-primary-100 text-primary-700 rounded-2xl px-5 py-4 text-center shadow-sm">
                    {feedbackMessage}
                </div>
            )}

            {teas.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <span className="text-5xl mb-4">🪴</span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có sản phẩm</h3>
                    <p className="text-gray-500 max-w-md">Hiện tại chưa có loại trà nào. Vui lòng quay lại sau hoặc sử dụng tính năng AI Pha Trà!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {teas.map((tea) => (
                        <ProductCard key={tea._id} tea={tea} onAddToCart={addToCart} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeaList;
