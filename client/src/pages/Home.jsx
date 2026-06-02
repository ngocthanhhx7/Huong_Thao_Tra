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
                    description: tea.description || 'Công thức trà thảo mộc đang được Hương Thảo Trà cập nhật thông tin chi tiết.',
                    price: tea.price || 0,
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
            review: 'Trà của Hương Thảo Trà có hương vị nhẹ, dễ uống. Công cụ AI giúp tôi chọn đúng công thức phù hợp với thói quen buổi tối.',
        },
        {
            name: 'Trần Văn B',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            rating: 5,
            review: 'Tôi thích cách sản phẩm mô tả rõ công dụng và thành phần. Việc đặt hàng cũng đơn giản, không phải tìm quá nhiều.',
        },
        {
            name: 'Lê Thị C',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
            rating: 4,
            review: 'Sản phẩm chất lượng, giao hàng nhanh. Các gợi ý từ AI giúp tôi thử được nhiều vị trà mới mà vẫn hợp khẩu vị.',
        },
    ];

    const filteredProducts = featuredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <HeroBanner />

            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="mb-3 text-sm font-extrabold uppercase text-primary-700">Công thức nổi bật</p>
                            <h2 className="text-3xl font-black text-leaf-800 md:text-4xl">Các công thức AI phổ biến</h2>
                            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
                                Những lựa chọn được cộng đồng đánh giá cao và phù hợp với nhiều nhu cầu chăm sóc sức khỏe hằng ngày.
                            </p>
                        </div>
                        <Link to="/teas" className="wellness-focus inline-flex min-h-11 items-center justify-center rounded-lg border border-leaf-100 px-4 py-2 text-sm font-extrabold text-primary-700 transition hover:bg-leaf-50">
                            Xem tất cả cửa hàng
                        </Link>
                    </div>

                    <div className="relative mb-8 max-w-lg">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm công thức trà..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="wellness-focus min-h-12 w-full rounded-lg border border-leaf-100 bg-leaf-50 py-3 pl-11 pr-4 font-semibold text-leaf-800 transition focus:bg-white"
                        />
                    </div>

                    {loading ? (
                        <div className="wellness-muted-surface p-10 text-center font-semibold text-gray-600">
                            Đang tải sản phẩm nổi bật...
                        </div>
                    ) : errorMessage ? (
                        <div className="rounded-xl border border-red-100 bg-red-50 p-10 text-center font-semibold text-red-700">
                            {errorMessage}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="wellness-muted-surface p-10 text-center font-semibold text-gray-600">
                            Chưa có sản phẩm phù hợp để hiển thị.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="bg-leaf-50 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <p className="mb-3 text-sm font-extrabold uppercase text-primary-700">Triết lý của chúng tôi</p>
                        <h2 className="text-3xl font-black text-leaf-800 md:text-4xl">Trà thảo mộc rõ nguồn gốc, dễ chọn, dễ dùng</h2>
                        <p className="mt-4 text-base leading-8 text-gray-600">
                            Hương Thảo Trà kết hợp kiến thức thảo mộc với công nghệ AI để giúp mỗi người tìm được công thức phù hợp với mục tiêu và thói quen riêng.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            {
                                title: 'Sứ mệnh',
                                description: 'Đưa trà thảo mộc đến gần hơn với đời sống hằng ngày bằng trải nghiệm tư vấn dễ hiểu.',
                            },
                            {
                                title: 'Tầm nhìn',
                                description: 'Trở thành nền tảng trà thảo mộc cá nhân hóa đáng tin cậy cho người dùng Việt.',
                            },
                            {
                                title: 'Nguyên liệu tự nhiên',
                                description: 'Ưu tiên thành phần rõ ràng, dễ nhận biết và phù hợp với từng mục tiêu sử dụng.',
                            },
                        ].map((item) => (
                            <article key={item.title} className="wellness-surface p-6">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M6 7c4 0 6 2 6 6-4 0-6-2-6-6ZM18 7c-4 0-6 2-6 6 4 0 6-2 6-6Z" />
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-xl font-black text-leaf-800">{item.title}</h3>
                                <p className="text-sm leading-7 text-gray-600">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <p className="mb-3 text-sm font-extrabold uppercase text-primary-700">Đánh giá thực tế</p>
                        <h2 className="text-3xl font-black text-leaf-800 md:text-4xl">Khách hàng nói gì về chúng tôi</h2>
                        <p className="mt-4 text-base leading-8 text-gray-600">
                            Những phản hồi giúp chúng tôi cải thiện sản phẩm, tư vấn AI và trải nghiệm mua sắm mỗi ngày.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {reviews.map((review) => (
                            <ReviewCard key={review.name} review={review} />
                        ))}
                    </div>
                </div>
            </section>

            <StatsSection />

            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="wellness-surface p-6 md:p-8">
                        <div className="mb-8 text-center">
                            <p className="mb-3 text-sm font-extrabold uppercase text-primary-700">Cần hỗ trợ?</p>
                            <h2 className="text-3xl font-black text-leaf-800 md:text-4xl">Đội ngũ Hương Thảo Trà luôn sẵn sàng lắng nghe</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-600">
                                Liên hệ với chúng tôi nếu bạn cần tư vấn sản phẩm, đơn hàng hoặc công thức trà phù hợp.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="wellness-muted-surface flex items-center gap-4 p-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-primary-700">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5A2.5 2.5 0 0 1 5.5 3h2L10 8l-2 1.5A12 12 0 0 0 14.5 16l1.5-2 5 2.5v2A2.5 2.5 0 0 1 18.5 21 15.5 15.5 0 0 1 3 5.5Z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-500">Hotline</p>
                                    <p className="text-lg font-black text-leaf-800">0876785504</p>
                                </div>
                            </div>

                            <div className="wellness-muted-surface flex items-center gap-4 p-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-primary-700">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-500">Email hỗ trợ</p>
                                    <p className="break-all text-lg font-black text-leaf-800">thanhnnhe186491@fpt.edu.vn</p>
                                </div>
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
