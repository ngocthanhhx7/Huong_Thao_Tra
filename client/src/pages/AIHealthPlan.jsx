import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AIHealthPlan = () => {
    const { user } = useContext(AuthContext);

    const [age, setAge] = useState(30);
    const [sleepTime, setSleepTime] = useState('7 giờ');
    const [stressLevel, setStressLevel] = useState('Trung bình');
    const [healthGoal, setHealthGoal] = useState('Cải thiện giấc ngủ và tiêu hóa');

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20 px-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mt-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white/0 pointer-events-none"></div>
                <div className="relative z-10 text-7xl mb-6 flex justify-center drop-shadow-sm">🌿</div>
                <h2 className="relative z-10 text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 tracking-tight">Đăng nhập để tạo liệu trình AI</h2>
                <p className="relative z-10 text-gray-500 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
                    Liệu trình sức khỏe AI hiện mở cho mọi tài khoản. Đăng nhập để hệ thống lưu lại phác đồ và lịch sử tư vấn của bạn.
                </p>
                <div className="relative z-10 group inline-block">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-emerald-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                    <Link to="/login" className="relative inline-flex bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-white/20">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await api.post('/ai/health-plan', { age, sleepTime, stressLevel, healthGoal });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Tạo liệu trình thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-gray-100 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
                        Liệu Trình AI
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Phác đồ trà thảo mộc cá nhân hóa theo thể trạng và mục tiêu sức khỏe</p>
                </div>
                <Link to="/ai-history" className="text-primary-600 hover:text-white font-bold text-sm bg-primary-50 hover:bg-primary-600 px-5 py-2.5 rounded-xl border border-primary-100 hover:border-transparent transition-all shadow-sm">Xem Lịch Sử</Link>
            </div>

            {!result && (
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-gray-100 max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thông tin thể trạng</h3>
                        <p className="text-gray-500">Giúp AI hiểu rõ cơ thể bạn để đưa ra phác đồ chính xác nhất</p>
                    </div>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2"><svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Độ tuổi</label>
                            <input type="number" min="18" max="100" value={age} onChange={e => setAge(e.target.value)} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian ngủ TB</label>
                            <select value={sleepTime} onChange={e => setSleepTime(e.target.value)} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all outline-none appearance-none">
                                <option value="< 5 giờ">&lt; 5 giờ</option>
                                <option value="5-6 giờ">5-6 giờ</option>
                                <option value="7-8 giờ">7-8 giờ</option>
                                <option value="> 8 giờ">&gt; 8 giờ</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mức độ căng thẳng</label>
                            <select value={stressLevel} onChange={e => setStressLevel(e.target.value)} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all outline-none appearance-none">
                                <option value="Thấp">Nhẹ nhàng</option>
                                <option value="Trung bình">Bình thường</option>
                                <option value="Cao">Căng thẳng</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mục tiêu sức khỏe mong muốn</label>
                            <textarea
                                value={healthGoal}
                                onChange={e => setHealthGoal(e.target.value)}
                                rows="3"
                                placeholder="VD: Tôi muốn cải thiện tiêu hóa và khắc phục lịch ngủ thất thường..."
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all outline-none resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-10 w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-2xl font-bold text-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:hover:shadow-none transition-all duration-300 flex justify-center items-center gap-3 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        {loading ? (
                            <>
                                <span className="animate-spin text-xl">✨</span>
                                <span>Đang phân tích dữ liệu...</span>
                            </>
                        ) : (
                            <>
                                <span>Lên Phác Đồ Sinh Học</span>
                                <span className="text-xl">✨</span>
                            </>
                        )}
                    </button>
                </form>
            )}

            {result && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                    <div className="bg-gradient-to-br from-primary-900 to-gray-900 text-white p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">Phác Đồ Sinh Học Của Bạn</h2>
                            <p className="text-primary-100/80 text-lg max-w-xl">Hệ thống AI đã phân tích thành công và thiết lập chu trình chăm sóc sức khỏe tối ưu dành riêng cho bạn.</p>
                        </div>
                        <button onClick={() => setResult(null)} className="relative z-10 bg-white/10 hover:bg-white text-white hover:text-gray-900 px-6 py-3 rounded-xl text-sm font-bold backdrop-blur-sm border border-white/20 transition-all duration-300 whitespace-nowrap">
                            Làm Mới Phác Đồ
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="text-4xl mb-4 relative z-10">🌅</div>
                            <h3 className="text-blue-600 font-extrabold text-sm tracking-widest uppercase mb-2 relative z-10">Trà Buổi Sáng</h3>
                            <h4 className="text-xl font-bold text-gray-900 mb-4 tracking-tight leading-snug relative z-10">{result.morningTea?.name}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed relative z-10">{result.morningTea?.reason}</p>
                        </div>

                        <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-bl from-amber-50 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="text-4xl mb-4 relative z-10">☀️</div>
                            <h3 className="text-amber-500 font-extrabold text-sm tracking-widest uppercase mb-2 relative z-10">Trà Buổi Chiều</h3>
                            <h4 className="text-xl font-bold text-gray-900 mb-4 tracking-tight leading-snug relative z-10">{result.afternoonTea?.name}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed relative z-10">{result.afternoonTea?.reason}</p>
                        </div>

                        <div className="bg-white p-8 border border-gray-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] transition-all duration-300">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="text-4xl mb-4 relative z-10">🌙</div>
                            <h3 className="text-indigo-500 font-extrabold text-sm tracking-widest uppercase mb-2 relative z-10">Trà Buổi Tối</h3>
                            <h4 className="text-xl font-bold text-gray-900 mb-4 tracking-tight leading-snug relative z-10">{result.nightTea?.name}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed relative z-10">{result.nightTea?.reason}</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12">
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">Khuyến Nghị Lối Sống Tối Ưu</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex flex-col h-full space-y-4">
                                <h4 className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg shadow-sm">💤</div>
                                    Lịch Trình Giấc Ngủ
                                </h4>
                                <div className="bg-blue-50/50 border border-blue-100/50 p-6 rounded-2xl flex-grow">
                                    <p className="text-gray-600 leading-relaxed">{result.sleepSchedule}</p>
                                </div>
                            </div>
                            <div className="flex flex-col h-full space-y-4">
                                <h4 className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-lg shadow-sm">🥗</div>
                                    Điều Chỉnh Chế Độ Ăn
                                </h4>
                                <div className="bg-green-50/50 border border-green-100/50 p-6 rounded-2xl flex-grow">
                                    <p className="text-gray-600 leading-relaxed">{result.dietSuggestion}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIHealthPlan;
