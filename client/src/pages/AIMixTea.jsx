import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const AIMixTea = () => {
    const [form, setForm] = useState({
        goals: ['giảm căng thẳng'],
        symptoms: '',
        stressLevel: 'trung bình',
        sleepQuality: 'bình thường',
        flavorPreference: 'hương hoa',
        caffeinePreference: 'không caffeine',
        drinkTime: 'buổi tối',
        ageGroup: '18-50',
        allergies: '',
        avoid: '',
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                ...form,
                goal: form.goals.join(', '),
                symptoms: form.symptoms ? form.symptoms.split(',').map(s => s.trim()).filter(Boolean) : [],
                allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
                avoid: form.avoid ? form.avoid.split(',').map(s => s.trim()).filter(Boolean) : [],
            };
            delete payload.goals;
            const res = await api.post('/ai/mix-tea', payload);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Tạo công thức trà thất bại');
        } finally {
            setLoading(false);
        }
    };

    const buildMarkdown = (r) => {
        let md = `## 🍵 ${r.teaName}\n\n`;
        md += `**🌿 Công dụng:**  \n${r.useCase}\n\n`;

        if (r.coreHerb || r.supportHerbs?.length || r.flavorHerb) {
            md += `**🧬 Cấu trúc công thức:**\n`;
            if (r.coreHerb) md += `- **Thảo mộc chính:** ${r.coreHerb}\n`;
            if (r.supportHerbs?.length) md += `- **Hỗ trợ:** ${r.supportHerbs.join(', ')}\n`;
            if (r.flavorHerb) md += `- **Tạo hương:** ${r.flavorHerb}\n`;
            md += '\n';
        }

        md += `**📋 Nguyên liệu:**\n\n`;
        r.ingredients?.forEach(ing => {
            if (typeof ing === 'object') {
                md += `- **${ing.name}** – ${ing.amount} *(${ing.role})*\n`;
            } else {
                md += `- ${ing}\n`;
            }
        });
        md += '\n';

        md += `**⚖️ Tỉ lệ pha:**  \n${r.ratio}\n\n`;

        if (r.brewSteps?.length) {
            md += `**🫖 Cách pha:**\n\n`;
            r.brewSteps.forEach((step, i) => { md += `${i + 1}. ${step}\n`; });
            md += '\n';
        }

        md += `**💚 Lợi ích sức khỏe:**\n\n`;
        r.benefits?.forEach(b => { md += `- ${b}\n`; });
        md += '\n';

        if (r.frequency) {
            md += `**⏱ Tần suất sử dụng:**  \n${r.frequency}\n\n`;
        }

        if (r.suggestions?.length) {
            md += `**✨ Gợi ý:**\n\n`;
            r.suggestions.forEach(s => { md += `- ${s}\n`; });
            md += '\n';
        }

        if (r.warnings?.length) {
            md += `**⚠️ Lưu ý:**\n\n`;
            r.warnings.forEach(w => { md += `- ${w}\n`; });
        }

        return md;
    };

    const selectClass = "w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none hover:bg-white hover:shadow-sm";
    const labelClass = "block text-sm font-semibold text-gray-800 mb-2";
    const groupCardClass = "bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]";

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-10 md:mb-14">
                <div className="inline-flex items-center justify-center p-3 bg-primary-50 text-primary-600 rounded-full mb-4">
                    <span className="text-3xl">🌿</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">AI Pha Trà Thảo Mộc</h1>
                <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
                    Khám phá công thức trà độc bản dành riêng cho bạn. Cung cấp tình trạng sức khỏe, AI chuyên gia sẽ pha chế ngay lập tức.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                {/* Form - Left Side (5 columns on huge screens) */}
                <div className="lg:col-span-12 xl:col-span-5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 sticky top-6">

                        {/* Section: Mục tiêu cá nhân */}
                        <div className={groupCardClass}>
                            <div className="mb-5">
                                <label className={labelClass}>Mục tiêu sức khỏe <span className="text-xs font-normal text-gray-400 ml-1">(chọn ít nhất 1)</span></label>
                                <div className="flex flex-wrap gap-2.5 mt-3">
                                    {[
                                        { value: 'giảm căng thẳng', label: '😌 Giảm Căng Thẳng' },
                                        { value: 'ngủ ngon hơn', label: '🌙 Ngủ Ngon Hơn' },
                                        { value: 'tăng cường năng lượng', label: '⚡ Tăng Năng Lượng' },
                                        { value: 'cải thiện tiêu hóa', label: '🍃 Cải Thiện Tiêu Hóa' },
                                        { value: 'tăng sức đề kháng', label: '🛡️ Tăng Đề Kháng' },
                                        { value: 'tăng cường sự tập trung', label: '🎯 Giúp Tập Trung' },
                                        { value: 'giải độc cơ thể', label: '💧 Giải Độc Cơ Thể' },
                                        { value: 'hỗ trợ tim mạch', label: '❤️ Hỗ Trợ Tim Mạch' },
                                        { value: 'hỗ trợ giảm cân', label: '⚖️ Hỗ Trợ Giảm Cân' },
                                        { value: 'hỗ trợ dưỡng da', label: '✨ Dưỡng Da' },
                                    ].map(opt => (
                                        <label
                                            key={opt.value}
                                            className={`inline-flex items-center px-4 py-2 rounded-full border cursor-pointer text-sm transition-all duration-200 ${form.goals.includes(opt.value)
                                                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20 scale-105'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50/50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={form.goals.includes(opt.value)}
                                                onChange={() => {
                                                    setForm(prev => {
                                                        const exists = prev.goals.includes(opt.value);
                                                        const next = exists
                                                            ? prev.goals.filter(g => g !== opt.value)
                                                            : [...prev.goals, opt.value];
                                                        return { ...prev, goals: next.length ? next : prev.goals };
                                                    });
                                                }}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Triệu chứng hiện tại <span className="text-xs font-normal text-gray-400 ml-1">(không bắt buộc)</span></label>
                                <input type="text" name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="VD: đau đầu, mất ngủ, đầy hơi..." className={selectClass} />
                            </div>
                        </div>

                        {/* Section: Tình trạng (Stress, Ngủ, Tuổi) */}
                        <div className={`${groupCardClass} grid grid-cols-2 gap-5`}>
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Độ tuổi</label>
                                <select name="ageGroup" value={form.ageGroup} onChange={handleChange} className={selectClass}>
                                    <option value="<18">Dưới 18 tuổi</option>
                                    <option value="18-50">18 – 50 tuổi</option>
                                    <option value="50+">Trên 50 tuổi</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Mức độ stress</label>
                                <select name="stressLevel" value={form.stressLevel} onChange={handleChange} className={selectClass}>
                                    <option value="thấp">Thấp</option>
                                    <option value="trung bình">Trung bình</option>
                                    <option value="cao">Cao</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className={labelClass}>Chất lượng giấc ngủ</label>
                                <select name="sleepQuality" value={form.sleepQuality} onChange={handleChange} className={selectClass}>
                                    <option value="tốt">Tốt - Ngủ sâu giấc</option>
                                    <option value="bình thường">Bình thường</option>
                                    <option value="kém">Kém / Thường xuyên mất ngủ</option>
                                </select>
                            </div>
                        </div>

                        {/* Section: Sở thích cá nhân */}
                        <div className={`${groupCardClass} grid grid-cols-2 gap-5`}>
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Sở thích hương vị</label>
                                <select name="flavorPreference" value={form.flavorPreference} onChange={handleChange} className={selectClass}>
                                    <option value="hương hoa">🌸 Hương Hoa</option>
                                    <option value="mộc mạc">🍵 Mộc Mạc</option>
                                    <option value="hương bạc hà">🌿 Bạc Hà</option>
                                    <option value="hương trái cây">🍓 Trái Cây</option>
                                    <option value="vị cay ấm">🌶️ Vị Cay Ấm</option>
                                    <option value="vị thanh mát">🍋 Thanh Mát</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className={labelClass}>Caffeine</label>
                                <select name="caffeinePreference" value={form.caffeinePreference} onChange={handleChange} className={selectClass}>
                                    <option value="không caffeine">🚫 Không Caffeine</option>
                                    <option value="thấp">📉 Thấp</option>
                                    <option value="trung bình">➖ Trung Bình</option>
                                    <option value="cao">📈 Cao</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className={labelClass}>Thời điểm uống trà</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Buổi sáng', 'Buổi trưa', 'Buổi chiều', 'Buổi tối', 'Trước khi ngủ', 'Bất kỳ lúc nào'].map(time => (
                                        <label key={time} className={`text-center p-2 rounded-xl border cursor-pointer transition text-xs md:text-sm ${form.drinkTime.toLowerCase() === time.toLowerCase() ? 'bg-primary-50 border-primary-500 text-primary-700 font-semibold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                            <input type="radio" name="drinkTime" value={time.toLowerCase()} checked={form.drinkTime.toLowerCase() === time.toLowerCase()} onChange={handleChange} className="hidden" />
                                            {time}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section: Dị ứng */}
                        <div className={groupCardClass}>
                            <label className={labelClass}>Dị ứng / Tránh <span className="text-xs font-normal text-gray-400 ml-1">(không bắt buộc)</span></label>
                            <input type="text" name="avoid" value={form.avoid} onChange={handleChange} placeholder="VD: gừng, quế, cam thảo, cỏ ngọt..." className={selectClass} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] disabled:opacity-70 disabled:hover:shadow-none disabled:active:scale-100 transition-all duration-200 mt-2 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang phân tích dữ liệu...
                                </>
                            ) : (
                                <>✨ Bắt đầu pha chế</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Result - Right Side (7 columns on huge screens) */}
                <div className="lg:col-span-12 xl:col-span-7 mt-8 lg:mt-0">
                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 flex items-start gap-4 mb-6 shadow-sm">
                            <span className="text-2xl mt-0.5">⚠️</span>
                            <div>
                                <h3 className="font-bold text-red-800">Không thể tạo công thức</h3>
                                <p className="text-sm mt-1 opacity-90">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full min-h-[600px] flex flex-col items-center justify-center p-12 text-primary-600">
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 border-4 border-primary-100 rounded-full animate-ping opacity-75"></div>
                                <div className="absolute inset-0 bg-primary-50 rounded-full flex items-center justify-center text-4xl shadow-inner z-10 animate-bounce">
                                    🍵
                                </div>
                            </div>
                            <h3 className="font-extrabold text-2xl text-gray-800 text-center mb-3">AI đang suy nghĩ...</h3>
                            <div className="flex flex-col items-center gap-2 text-gray-500 font-medium text-center">
                                <p className="animate-pulse delay-75">🔍 Đang phân tích mục tiêu & triệu chứng</p>
                                <p className="animate-pulse delay-150">🌿 Đang chọn lọc thảo mộc tương thích</p>
                                <p className="animate-pulse delay-300">⚖️ Đang cân đối thành phần dinh dưỡng</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !result && !error && (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-300 h-full min-h-[300px] xl:min-h-[700px] flex flex-col items-center justify-center p-10 text-gray-400 bg-gradient-to-b from-transparent to-gray-50/50">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-5xl shadow-sm border border-gray-100">
                                🪴
                            </div>
                            <h3 className="text-xl font-bold text-gray-600 mb-2 text-center">Chờ đợi thông tin từ bạn</h3>
                            <p className="text-center text-sm md:text-base max-w-sm leading-relaxed">
                                Hãy cho chúng tôi biết nhu cầu sức khỏe của bạn bên form trái, AI sẽ phân tích và đưa ra công thức trà thảo mộc hoàn hảo dành riêng cho bạn.
                            </p>
                        </div>
                    )}

                    {/* Result Success State */}
                    {result && (
                        <div className="space-y-6 lg:sticky lg:top-6">
                            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden relative">
                                {/* Decor header background */}
                                <div className="h-4 bg-gradient-to-r from-primary-400 via-primary-500 to-emerald-500 w-full"></div>

                                <div className="p-8 md:p-10 relative">
                                    {/* Watermark/deco item */}
                                    <div className="absolute top-8 right-8 text-7xl opacity-[0.03] select-none pointer-events-none">🌿</div>

                                    <div className="prose prose-stone lg:prose-lg max-w-none 
                                        prose-headings:font-bold prose-headings:text-gray-900 
                                        prose-h2:text-3xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-4 prose-h2:mb-6
                                        prose-strong:text-primary-800 prose-strong:font-bold
                                        prose-ul:list-none prose-ul:pl-0 
                                        prose-li:flex prose-li:items-start prose-li:mb-2 prose-li:leading-relaxed
                                        prose-li:before:content-['•'] prose-li:before:text-primary-400 prose-li:before:font-bold prose-li:before:mr-3 prose-li:before:text-xl prose-li:before:leading-tight
                                        prose-p:text-gray-600 prose-p:leading-relaxed"
                                    >
                                        <ReactMarkdown>{buildMarkdown(result)}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setResult(null)}
                                    className="flex-1 bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
                                >
                                    🔄 Pha công thức khác
                                </button>
                                <button className="flex-1 bg-gray-900 text-white p-4 rounded-2xl font-bold hover:bg-black shadow-[0_4px_15px_-3px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_-3px_rgba(0,0,0,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                    🛒 Đặt mua công thức này
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIMixTea;
