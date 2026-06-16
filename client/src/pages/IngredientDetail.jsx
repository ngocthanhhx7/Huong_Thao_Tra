import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const IngredientDetail = () => {
    const { id } = useParams();
    const [ingredient, setIngredient] = useState(null);
    const [relatedTeas, setRelatedTeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('benefits'); // benefits, details, precaution

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/ingredients/${id}`);
                setIngredient(data);

                // Fetch teas to find the ones containing this ingredient
                const teasRes = await api.get('/teas');
                const matched = (teasRes.data || []).filter((tea) =>
                    (tea.ingredients || []).some(
                        (ing) => (typeof ing === 'object' ? ing._id : ing) === id
                    )
                );
                setRelatedTeas(matched);
            } catch (error) {
                console.error('Failed to fetch ingredient details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="luxury-page flex items-center justify-center min-h-screen">
                <div className="text-center py-20 text-gray-600 font-bold">
                    Đang tải chi tiết trà liệu...
                </div>
            </div>
        );
    }

    if (!ingredient) {
        return (
            <div className="luxury-page flex items-center justify-center min-h-screen">
                <div className="text-center py-20">
                    <span className="text-5xl mb-4">⚠️</span>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy nguyên liệu</h2>
                    <p className="text-gray-500 mb-6">Nguyên liệu này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
                    <Link to="/ingredients" className="bg-primary-700 text-white px-6 py-2.5 rounded-lg font-bold">
                        Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="luxury-page pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    to="/ingredients"
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-600 hover:text-primary-700 mb-8 transition"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại bách khoa trà liệu
                </Link>

                {/* 40/60 Asymmetric Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[4.2fr_5.8fr] gap-12 items-start">
                    {/* Left: Sticky Image Card */}
                    <div className="lg:sticky lg:top-28">
                        <div className="luxury-card overflow-hidden shadow-xl rounded-3xl border border-leaf-100/50 bg-white p-4">
                            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-leaf-50 relative">
                                {ingredient.image ? (
                                    <img
                                        src={ingredient.image}
                                        alt={ingredient.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-emerald-50 to-amber-50 flex items-center justify-center">
                                        <span className="text-7xl">🌿</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-5 text-center px-2">
                                <h2 className="text-xl font-black text-leaf-800">{ingredient.name}</h2>
                                <p className="text-sm text-primary-700 font-extrabold mt-1">
                                    Giá trị tham khảo: {ingredient.pricePerGram ? `${ingredient.pricePerGram.toLocaleString('vi-VN')}đ / gram` : 'Chưa cập nhật'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Narrative details */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="bg-primary-50 border border-primary-100 text-primary-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                    Thảo mộc tự nhiên
                                </span>
                                {ingredient.caffeine ? (
                                    <span className="bg-amber-50 border border-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                        Có chứa Caffeine
                                    </span>
                                ) : (
                                    <span className="bg-green-50 border border-green-100 text-green-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                        Không chứa Caffeine
                                    </span>
                                )}
                            </div>
                            <h1 className="font-display-h1 text-4xl md:text-5xl text-leaf-900 leading-tight mb-4">
                                {ingredient.name}
                            </h1>
                            <p className="text-base text-gray-700 leading-8 whitespace-pre-line">
                                {ingredient.description || 'Chưa có mô tả khái quát.'}
                            </p>
                        </div>

                        {/* Tabs Bar */}
                        <div className="border-b border-leaf-100/60 flex gap-6 overflow-x-auto scrollbar-none">
                            {[
                                { id: 'benefits', label: 'Công dụng y học' },
                                { id: 'details', label: 'Đặc tính & Phân biệt' },
                                { id: 'precaution', label: 'Lưu ý phối trộn' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-extrabold whitespace-nowrap transition relative ${
                                        activeTab === tab.id
                                            ? 'text-primary-700'
                                            : 'text-gray-500 hover:text-primary-600'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white/90 border border-leaf-100/30 rounded-3xl p-6 md:p-8 shadow-sm">
                            {activeTab === 'benefits' && (
                                <div className="space-y-6">
                                    {ingredient.benefitsDetail ? (
                                        <div>
                                            <h3 className="text-lg font-black text-leaf-800 mb-3">Tác dụng dược lý & Trị liệu</h3>
                                            <p className="text-gray-700 leading-8 whitespace-pre-line text-sm md:text-base">
                                                {ingredient.benefitsDetail}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">Chưa có thông tin công dụng chi tiết của loại thảo mộc này.</p>
                                    )}

                                    {ingredient.benefits && ingredient.benefits.length > 0 && (
                                        <div className="pt-6 border-t border-leaf-50">
                                            <h4 className="text-sm font-black text-leaf-800 uppercase tracking-wider mb-3">Tóm tắt công dụng chính</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {ingredient.benefits.map((b, i) => (
                                                    <span key={i} className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-100/60">
                                                        ✓ {b}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-black text-leaf-800 mb-3">Ngoại hình & Màu sắc</h3>
                                        <p className="text-gray-700 leading-8 whitespace-pre-line text-sm md:text-base">
                                            {ingredient.appearance || 'Chưa có thông tin đặc tính ngoại hình.'}
                                        </p>
                                    </div>
                                    {ingredient.identification && (
                                        <div className="pt-6 border-t border-leaf-50">
                                            <h3 className="text-lg font-black text-leaf-800 mb-3">Cách phân biệt thảo mộc thật / giả</h3>
                                            <p className="text-gray-700 leading-8 whitespace-pre-line text-sm md:text-base text-leaf-800 bg-leaf-50/50 p-4 rounded-xl border border-leaf-100/30">
                                                {ingredient.identification}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'precaution' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-black text-leaf-800 mb-2">Chống chỉ định & Lưu ý phối trộn</h3>
                                    {ingredient.precautions ? (
                                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 text-gray-700 leading-8 text-sm md:text-base">
                                            <div className="flex gap-3">
                                                <span className="text-xl shrink-0">⚠️</span>
                                                <p className="whitespace-pre-line">{ingredient.precautions}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">Không có lưu ý phối trộn đặc biệt nào cho loại nguyên liệu này.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Related Products */}
                        {relatedTeas.length > 0 && (
                            <div className="pt-8 border-t border-leaf-100/40">
                                <h3 className="text-xl font-black text-leaf-800 mb-6">Sản phẩm trà có chứa {ingredient.name}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {relatedTeas.map((tea) => (
                                        <Link
                                            key={tea._id}
                                            to={`/teas/${tea._id}`}
                                            className="flex items-center gap-4 bg-white/70 hover:bg-white border border-leaf-100/40 p-3 rounded-2xl hover:shadow-md transition group"
                                        >
                                            <img
                                                src={tea.image}
                                                alt={tea.name}
                                                className="w-16 h-16 rounded-xl object-cover shrink-0"
                                            />
                                            <div>
                                                <h4 className="font-extrabold text-gray-800 group-hover:text-primary-700 transition line-clamp-1">
                                                    {tea.name}
                                                </h4>
                                                <p className="text-xs text-primary-700 font-bold mt-0.5">
                                                    {tea.price ? `${tea.price.toLocaleString('vi-VN')}đ` : ''}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IngredientDetail;
