import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const { data } = await api.get('/ingredients');
                setIngredients(data || []);
            } catch (error) {
                console.error('Failed to fetch ingredients', error);
            } finally {
                setLoading(false);
            }
        };
        fetchIngredients();
    }, []);

    const filtered = ingredients.filter((ing) =>
        `${ing.name || ''} ${ing.description || ''}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="luxury-page flex items-center justify-center min-h-screen">
                <div className="text-center py-20 text-gray-600 font-bold">
                    Đang tải thư viện trà liệu...
                </div>
            </div>
        );
    }

    return (
        <div className="luxury-page pt-28 pb-20">
            <div className="luxury-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="luxury-kicker">🌿 Bách khoa trà liệu</span>
                    <h1 className="font-display-h1 text-4xl md:text-6xl text-[#27451f] mt-4 mb-4">Danh mục thảo mộc tự nhiên</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-7">
                        Khám phá công dụng, đặc điểm ngoại hình, cách nhận biết và các lưu ý phối trộn của từng loại nguyên liệu thảo mộc lành tính của Trà Hoa Việt.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-12 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm thảo mộc (ví dụ: hoa cúc, táo đỏ,...) ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 border border-leaf-100 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-700 transition"
                    />
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="luxury-card p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                        <span className="text-4xl mb-4">🍃</span>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Không tìm thấy nguyên liệu</h3>
                        <p className="text-gray-500 max-w-md">Thử tìm kiếm với từ khóa khác.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((ing) => (
                            <Link
                                key={ing._id}
                                to={`/ingredients/${ing._id}`}
                                className="luxury-card luxury-card-hover group overflow-hidden block flex flex-col h-full border border-leaf-100/50 bg-white/90"
                            >
                                <div className="aspect-[4/3] w-full bg-leaf-50 overflow-hidden relative border-b border-leaf-100/40">
                                    {ing.image ? (
                                        <img
                                            src={ing.image}
                                            alt={ing.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-emerald-50 to-amber-50 flex items-center justify-center">
                                            <span className="text-4xl filter grayscale group-hover:grayscale-0 transition duration-300">🌿</span>
                                        </div>
                                    )}
                                    {ing.caffeine && (
                                        <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                            Có Caffeine
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black text-leaf-800 group-hover:text-primary-700 transition">
                                            {ing.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                            {ing.description || 'Chưa có mô tả chi tiết về thảo mộc này.'}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-leaf-50 flex flex-wrap gap-1.5">
                                        {ing.benefits && ing.benefits.slice(0, 2).map((b, i) => (
                                            <span key={i} className="bg-primary-50 text-primary-700 text-[10px] font-black px-2 py-0.5 rounded-md">
                                                {b}
                                            </span>
                                        ))}
                                        {ing.benefits && ing.benefits.length > 2 && (
                                            <span className="text-[10px] text-gray-400 font-bold self-center">
                                                + {ing.benefits.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ingredients;
