import { useState, useEffect } from 'react';
import api from '../services/api';

const TeaList = () => {
    const [teas, setTeas] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Đang tải danh sách trà cao cấp...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Bộ Sưu Tập Của Chúng Tôi</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">Khám phá các dòng trà cao cấp và công thức cá nhân hóa được yêu thích nhất.</p>
            </div>
            
            {teas.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <span className="text-5xl mb-4">🪴</span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có sản phẩm</h3>
                    <p className="text-gray-500 max-w-md">Hiện tại chưa có loại trà nào. Vui lòng quay lại sau hoặc sử dụng tính năng AI Pha Trà!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {teas.map((tea) => (
                        <div key={tea._id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-10px_rgba(0,180,100,0.15)] transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1.5 h-full">
                            <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                                <img
                                    src={tea.image || 'https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?q=80&w=800&auto=format&fit=crop'}
                                    alt={tea.name}
                                    className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {tea.isAIMixture && (
                                    <span className="absolute top-4 right-4 bg-primary-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10 flex items-center gap-1">
                                        ✨ Công Thức AI
                                    </span>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">{tea.name}</h3>
                                </div>
                                <p className="text-[11px] font-bold text-primary-600 uppercase tracking-widest mb-4">Caffeine: {tea.caffeineLevel}</p>

                                <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow leading-relaxed">{tea.description}</p>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                    <span className="font-extrabold text-xl text-gray-900">${tea.price.toFixed(2)}</span>
                                    <button className="bg-gray-100 text-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-500 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-primary-500/30 active:scale-95 transition-all duration-200 flex items-center gap-2">
                                        <span>🛒</span> Mua
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeaList;
