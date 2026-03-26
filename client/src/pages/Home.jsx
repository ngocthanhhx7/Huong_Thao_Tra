import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import api from '../services/api';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                setErrorMessage('');

                const { data } = await api.get('/teas');
                const products = (data || []).slice(0, 3).map((tea) => ({
                    id: tea._id,
                    name: tea.name,
                    category: tea.mixGoal || tea.caffeineLevel || 'Thảo mộc',
                    description: tea.description,
                    price: tea.price,
                    rating: tea.rating || 0,
                    reviews: tea.numReviews || 0,
                    image: tea.image,
                }));

                setFeaturedProducts(products);
            } catch (error) {
                console.error('Failed to fetch featured teas', error);
                setErrorMessage('Không thể tải sản phẩm nổi bật lúc này.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const reviews = [
        {
            name: 'Nguyễn Thị A',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
            rating: 5,
            review: 'Trà của Hương Thảo Trà thực sự tuyệt vời! AI pha trà rất chính xác với sở thích của tôi.',
        },
        {
            name: 'Trần Văn B',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            rating: 5,
            review: 'Liệu trình AI giúp tôi cải thiện sức khỏe đáng kể. Rất đáng tin cậy!',
        },
        {
            name: 'Lê Thị C',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
            rating: 4,
            review: 'Sản phẩm chất lượng cao, giao hàng nhanh. Sẽ tiếp tục ủng hộ!',
        },
    ];

    const filteredProducts = featuredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen">
            <HeroBanner />

            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Các Công Thức AI Phổ Biến</h2>
                            <p className="text-gray-500 mt-3 text-lg">Được cộng đồng đánh giá cao và lưu trữ nhiều nhất</p>
                        </div>
                        <Link to="/teas" className="group flex items-center gap-2 text-primary-600 font-bold hover:text-primary-800 transition-colors">
                            Xem tất cả cửa hàng <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </Link>
                    </div>

                    <div className="mb-10 relative max-w-lg">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm công thức trà..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                        />
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
                            Đang tải sản phẩm nổi bật...
                        </div>
                    ) : errorMessage ? (
                        <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-10 text-center text-red-500">
                            {errorMessage}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm p-10 text-center text-gray-500">
                            Chưa có sản phẩm phù hợp để hiển thị.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">Triết lý của chúng tôi</h2>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Về Hương Thảo Trà</h3>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            Chúng tôi kết hợp sức mạnh của công nghệ AI tiên tiến với tri thức hàng ngàn năm về thảo mộc tự nhiên để mang đến những trải nghiệm chăm sóc sức khỏe cá nhân hóa đỉnh cao.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-primary-100/50">
                                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sứ mệnh</h3>
                            <p className="text-gray-500 leading-relaxed">Đem đến sức khỏe tự nhiên thông qua trà thảo mộc được thiết kế chuyên biệt bởi phân tích AI.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-primary-100/50">
                                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Tầm nhìn</h3>
                            <p className="text-gray-500 leading-relaxed">Trở thành nền tảng toàn cầu tiên phong về chăm sóc sức khỏe tĩnh tại với công nghệ thông minh.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-primary-100/50">
                                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Nguyên liệu tự nhiên</h3>
                            <p className="text-gray-500 leading-relaxed">100% thảo mộc hữu cơ nguyên bản, được chọn lọc khắt khe từ các nông trại sinh thái.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">Đánh giá thực tế</h2>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Khách hàng nói gì về chúng tôi</h3>
                        <p className="text-gray-500 text-lg">Hàng ngàn người dùng đã cải thiện sức khỏe thể chất lẫn tinh thần</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <ReviewCard key={index} review={review} />
                        ))}
                    </div>
                </div>
            </section>

            <StatsSection />

            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary-50 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 bg-white/60 backdrop-blur-md p-10 md:p-14 rounded-3xl border border-primary-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">Cần hỗ trợ?</h2>
                    <p className="text-gray-500 mb-10 text-lg max-w-xl mx-auto">Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn.</p>
                    <div className="flex flex-col sm:flex-row gap-6 md:gap-12 justify-center items-center">
                        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Hotline</div>
                                <span className="text-gray-900 font-bold text-lg">0876785504</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email hỗ trợ</div>
                                <span className="text-gray-900 font-bold text-lg">thanhnnhe186491@fpt.edu.vn</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
