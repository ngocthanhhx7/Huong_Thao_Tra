import { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const GOAL_OPTIONS = ['Giảm căng thẳng', 'Ngủ ngon hơn', 'Thanh nhiệt', 'Tiêu hóa nhẹ bụng', 'Dưỡng nhan', 'Làm ấm cơ thể'];
const SYMPTOM_OPTIONS = ['Hay căng thẳng', 'Khó ngủ', 'Mệt mỏi', 'Đầy bụng', 'Nóng trong', 'Khó tập trung', 'Khô họng', 'Muốn detox nhẹ'];
const STRESS_OPTIONS = ['Thấp', 'Trung bình', 'Cao'];
const SLEEP_OPTIONS = ['Ngủ tốt', 'Ngủ bình thường', 'Khó ngủ'];
const FLAVOR_OPTIONS = ['Hương hoa', 'Trái cây', 'Thanh mát', 'Ấm cay', 'Ngọt dịu'];
const INTENSITY_OPTIONS = ['Rất nhẹ', 'Cân bằng', 'Đậm vị'];
const CAFFEINE_OPTIONS = ['Không caffeine', 'Ít caffeine', 'Caffeine vừa'];
const DRINK_TIME_OPTIONS = ['Buổi sáng', 'Buổi trưa', 'Buổi chiều', 'Buổi tối'];
const AGE_OPTIONS = ['Dưới 18', '18-30', '31-50', 'Trên 50'];
const LIFESTYLE_OPTIONS = ['Ít vận động', 'Làm việc văn phòng', 'Hay vận động', 'Thường xuyên thức khuya'];
const ALLERGY_OPTIONS = ['Không có', 'Hoa cúc', 'Hoa hồng', 'Gừng', 'Cam thảo', 'Bạc hà'];
const AVOID_OPTIONS = ['Hoa cúc vàng', 'Hoa hồng', 'Kỷ tử', 'Táo đỏ', 'Long nhãn Hưng Yên', 'Gừng sấy khô thái lát', 'Hoa atiso', 'Lá bạc hà khô', 'Quế Thanh', 'Cỏ ngọt'];

const QUESTION_SCREENS = [
    {
        theme: 'Nhu cầu chính',
        title: 'Bắt đầu từ mục tiêu sức khỏe của bạn',
        description: 'AI cần biết bạn muốn ly trà hỗ trợ điều gì và cảm giác hiện tại ra sao.',
        questions: ['goal', 'symptoms'],
    },
    {
        theme: 'Trạng thái cơ thể',
        title: 'Mức căng thẳng và giấc ngủ gần đây',
        description: 'Hai yếu tố này giúp AI cân bằng nhóm thảo mộc thư giãn, làm ấm hoặc thanh mát.',
        questions: ['stressLevel', 'sleepQuality'],
    },
    {
        theme: 'Gu thưởng trà',
        title: 'Bạn thích hương vị trà như thế nào?',
        description: 'AI sẽ ưu tiên nguyên liệu tạo hương và độ đậm phù hợp với khẩu vị của bạn.',
        questions: ['flavorPreference', 'flavorIntensity'],
    },
    {
        theme: 'Thói quen sử dụng',
        title: 'Thời điểm uống và caffeine mong muốn',
        description: 'Thông tin này giúp công thức phù hợp hơn với lịch sinh hoạt trong ngày.',
        questions: ['caffeinePreference', 'drinkTime'],
    },
    {
        theme: 'Hồ sơ cá nhân',
        title: 'Độ tuổi và lối sống của bạn',
        description: 'AI sẽ điều chỉnh khuyến nghị theo nhóm tuổi và nhịp sinh hoạt thường gặp.',
        questions: ['ageGroup', 'lifestyle'],
    },
    {
        theme: 'An toàn nguyên liệu',
        title: 'Có nguyên liệu nào cần tránh không?',
        description: 'Các lựa chọn này sẽ được tổng hợp để AI tuyệt đối không đưa vào công thức.',
        questions: ['allergies', 'avoid'],
    },
    {
        theme: 'Ghi chú riêng',
        title: 'Bạn muốn nhắn thêm gì cho chuyên gia pha trà?',
        description: 'Đây là câu nhập tay tự do để cá nhân hóa thêm trước khi gửi AI xử lý.',
        questions: ['otherRequest'],
    },
];

const initialForm = {
    goal: 'Giảm căng thẳng',
    symptoms: ['Hay căng thẳng'],
    stressLevel: 'Trung bình',
    sleepQuality: 'Ngủ bình thường',
    flavorPreference: 'Hương hoa',
    flavorIntensity: 'Cân bằng',
    caffeinePreference: 'Không caffeine',
    drinkTime: 'Buổi tối',
    ageGroup: '18-30',
    lifestyle: 'Làm việc văn phòng',
    allergies: ['Không có'],
    avoid: [],
    otherRequest: '',
};

const ChoiceGroup = ({ label, helper, options, value, onChange }) => (
    <section className="rounded-[28px] border border-emerald-100/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(63,98,55,0.08)] backdrop-blur">
        <div className="mb-4">
            <p className="text-base font-extrabold text-gray-900">{label}</p>
            {helper && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
            {options.map((option) => {
                const active = value === option;
                return (
                    <button key={option} type="button" onClick={() => onChange(option)} className={`px-4 py-3 rounded-2xl border text-sm font-bold transition-all duration-300 ${active ? 'border-emerald-600 bg-gradient-to-r from-emerald-700 to-lime-600 text-white shadow-lg shadow-emerald-100 scale-[1.02]' : 'border-emerald-100 bg-[#fbfff7] text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'}`}>
                        {option}
                    </button>
                );
            })}
        </div>
    </section>
);

ChoiceGroup.propTypes = {
    label: PropTypes.string.isRequired,
    helper: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

ChoiceGroup.defaultProps = { helper: '' };

const MultiChoiceGroup = ({ label, helper, options, values, onToggle }) => (
    <section className="rounded-[28px] border border-emerald-100/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(63,98,55,0.08)] backdrop-blur">
        <div className="mb-4">
            <p className="text-base font-extrabold text-gray-900">{label}</p>
            {helper && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
            {options.map((option) => {
                const active = values.includes(option);
                return (
                    <button key={option} type="button" onClick={() => onToggle(option)} className={`px-4 py-3 rounded-2xl border text-sm font-bold transition-all duration-300 ${active ? 'border-[#456b2f] bg-[#456b2f] text-white shadow-lg shadow-lime-100 scale-[1.02]' : 'border-emerald-100 bg-[#fbfff7] text-gray-700 hover:border-lime-300 hover:bg-lime-50'}`}>
                        {option}
                    </button>
                );
            })}
        </div>
    </section>
);

MultiChoiceGroup.propTypes = {
    label: PropTypes.string.isRequired,
    helper: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggle: PropTypes.func.isRequired,
};

MultiChoiceGroup.defaultProps = { helper: '' };

const ResultSection = ({ result }) => (
    <div className="bg-white/95 rounded-[36px] border border-emerald-100 p-6 sm:p-8 space-y-6 shadow-xl shadow-emerald-100/40">
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#edf8df] via-[#fffaf0] to-[#e0f2d5] p-6">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/50" />
            <p className="relative text-sm uppercase tracking-[0.25em] text-emerald-800 font-extrabold">Công thức AI đã mix xong</p>
            <h2 className="font-display-h1 relative text-4xl sm:text-5xl text-[#25421f] mt-3">{result.teaName}</h2>
            <p className="text-gray-600 mt-4 leading-7">{result.useCase}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-5">
                <p className="text-sm font-extrabold text-emerald-800 mb-3">Nguyên liệu chính</p>
                <div className="space-y-3 text-sm text-gray-700">
                    {(result.ingredients || []).map((item, index) => (
                        <div key={`${typeof item === 'object' ? item.name : item}-${index}`} className="flex justify-between gap-3 rounded-2xl bg-white/75 p-3">
                            <span className="font-bold">{typeof item === 'object' ? item.name : item}</span>
                            <span className="text-gray-500 text-right">{typeof item === 'object' ? item.amount : ''}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="rounded-3xl bg-[#fbfff7] border border-lime-100 p-5 space-y-5">
                <div><p className="text-sm font-extrabold text-gray-800">Tỷ lệ phối</p><p className="text-gray-600 mt-1">{result.ratio}</p></div>
                <div><p className="text-sm font-extrabold text-gray-800">Tần suất dùng</p><p className="text-gray-600 mt-1">{result.frequency}</p></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-gray-100 p-5">
                <p className="text-sm font-extrabold text-gray-800 mb-3">Lợi ích nổi bật</p>
                <div className="flex flex-wrap gap-2">{(result.benefits || []).map((benefit) => <span key={benefit} className="px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold">{benefit}</span>)}</div>
            </div>
            <div className="rounded-3xl border border-gray-100 p-5">
                <p className="text-sm font-extrabold text-gray-800 mb-3">Lưu ý</p>
                <ul className="space-y-2 text-sm text-gray-600">{(result.warnings || []).length > 0 ? result.warnings.map((warning) => <li key={warning}>• {warning}</li>) : <li>Không có lưu ý đặc biệt từ AI cho lựa chọn này.</li>}</ul>
            </div>
        </div>

        <div className="rounded-3xl border border-gray-100 p-5">
            <p className="text-sm font-extrabold text-gray-800 mb-3">Cách pha gợi ý</p>
            <ol className="space-y-3 text-gray-600">{(result.brewSteps || []).map((step, index) => <li key={`${step}-${index}`} className="flex gap-3"><span className="h-7 w-7 rounded-full bg-emerald-800 text-white text-sm font-bold flex items-center justify-center shrink-0">{index + 1}</span><span>{step}</span></li>)}</ol>
        </div>
    </div>
);

ResultSection.propTypes = {
    result: PropTypes.shape({ teaName: PropTypes.string, useCase: PropTypes.string, ratio: PropTypes.string, frequency: PropTypes.string, ingredients: PropTypes.array, benefits: PropTypes.arrayOf(PropTypes.string), warnings: PropTypes.arrayOf(PropTypes.string), brewSteps: PropTypes.arrayOf(PropTypes.string) }).isRequired,
};

const AIMixTea = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState(initialForm);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [savedSuggestionId, setSavedSuggestionId] = useState('');
    const [activeScreen, setActiveScreen] = useState(0);
    const [direction, setDirection] = useState('forward');
    const currentScreen = QUESTION_SCREENS[activeScreen];
    const isResultScreen = Boolean(result);
    const progress = useMemo(() => Math.round(((activeScreen + 1) / QUESTION_SCREENS.length) * 100), [activeScreen]);

    const toggleValue = (field, option) => {
        setForm((prev) => {
            const currentValues = prev[field];
            const isNoOption = option === 'Không có';
            const hasValue = currentValues.includes(option);
            if (isNoOption) return { ...prev, [field]: hasValue ? [] : ['Không có'] };
            const baseValues = currentValues.filter((item) => item !== 'Không có');
            return { ...prev, [field]: hasValue ? baseValues.filter((item) => item !== option) : [...baseValues, option] };
        });
    };

    const buildInputParams = () => ({
        goal: form.goal,
        symptoms: form.symptoms,
        stressLevel: form.stressLevel,
        sleepQuality: form.sleepQuality,
        flavorPreference: `${form.flavorPreference} · ${form.flavorIntensity}`,
        caffeinePreference: form.caffeinePreference,
        drinkTime: form.drinkTime,
        ageGroup: form.ageGroup,
        allergies: form.allergies.filter((item) => item !== 'Không có'),
        avoid: form.avoid,
        otherRequest: [form.lifestyle ? `Lối sống: ${form.lifestyle}` : '', form.otherRequest].filter(Boolean).join('\n'),
    });

    const ensureLoggedIn = () => {
        if (user) return true;
        setError('Bạn cần đăng nhập để lưu, gửi duyệt bán hoặc mua ngay công thức AI.');
        return false;
    };

    const persistRecipe = async () => {
        const saveRes = await api.post('/ai/mix-tea/save', { result, inputParams: buildInputParams(), suggestionId: savedSuggestionId || undefined });
        setSavedSuggestionId(saveRes.data._id);
        return saveRes.data;
    };

    const nextScreen = () => {
        setDirection('forward');
        setActiveScreen((prev) => Math.min(prev + 1, QUESTION_SCREENS.length - 1));
    };

    const prevScreen = () => {
        setDirection('back');
        setActiveScreen((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (activeScreen < QUESTION_SCREENS.length - 1) {
            nextScreen();
            return;
        }
        setLoading(true); setError(''); setMessage('');
        try {
            const res = await api.post('/ai/mix-tea', buildInputParams());
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Tạo công thức trà thất bại.');
        } finally { setLoading(false); }
    };

    const saveRecipe = async () => {
        if (!result || !ensureLoggedIn()) return;
        setActionLoading('save'); setError(''); setMessage('');
        try { await persistRecipe(); setMessage('Công thức đã được lưu vào lịch sử AI của bạn.'); } catch (err) { setError(err.response?.data?.message || 'Không thể lưu công thức AI.'); } finally { setActionLoading(''); }
    };

    const submitRecipeForSale = async () => {
        if (!result || !ensureLoggedIn()) return;
        setActionLoading('submit'); setError(''); setMessage('');
        try {
            const suggestion = savedSuggestionId ? { _id: savedSuggestionId } : await persistRecipe();
            const submitRes = await api.post(`/ai/mix-tea/${suggestion._id}/submit-for-sale`, { price: 299000, stock: 10, image: '' });
            setSavedSuggestionId(submitRes.data.suggestion?._id || suggestion._id);
            setMessage('Công thức đã được gửi cho admin/staff duyệt.');
        } catch (err) { setError(err.response?.data?.message || 'Không thể gửi công thức AI để duyệt bán.'); } finally { setActionLoading(''); }
    };

    const buyNow = async () => {
        if (!result || !ensureLoggedIn()) return;
        setActionLoading('buy'); setError(''); setMessage('');
        try {
            const res = await api.post('/ai/mix-tea/buy-now', { result, inputParams: buildInputParams(), suggestionId: savedSuggestionId || undefined });
            setSavedSuggestionId(res.data.suggestion?._id || savedSuggestionId);
            navigate('/cart');
        } catch (err) { setError(err.response?.data?.message || 'Không thể thêm công thức AI vào giỏ hàng.'); } finally { setActionLoading(''); }
    };

    const restartQuestions = () => {
        setResult(null); setMessage(''); setError(''); setActiveScreen(0); setDirection('back');
    };

    const renderQuestion = (key) => {
        const map = {
            goal: <ChoiceGroup label="1. Bạn muốn trà hỗ trợ điều gì nhất?" helper="Chọn mục tiêu ưu tiên để AI xác định nhóm thảo mộc lõi." options={GOAL_OPTIONS} value={form.goal} onChange={(value) => setForm((prev) => ({ ...prev, goal: value }))} />,
            symptoms: <MultiChoiceGroup label="2. Triệu chứng hoặc cảm giác hiện tại" helper="Có thể chọn nhiều trạng thái đang gặp." options={SYMPTOM_OPTIONS} values={form.symptoms} onToggle={(value) => toggleValue('symptoms', value)} />,
            stressLevel: <ChoiceGroup label="3. Mức độ căng thẳng" options={STRESS_OPTIONS} value={form.stressLevel} onChange={(value) => setForm((prev) => ({ ...prev, stressLevel: value }))} />,
            sleepQuality: <ChoiceGroup label="4. Chất lượng giấc ngủ" options={SLEEP_OPTIONS} value={form.sleepQuality} onChange={(value) => setForm((prev) => ({ ...prev, sleepQuality: value }))} />,
            flavorPreference: <ChoiceGroup label="5. Gu vị bạn thích" options={FLAVOR_OPTIONS} value={form.flavorPreference} onChange={(value) => setForm((prev) => ({ ...prev, flavorPreference: value }))} />,
            flavorIntensity: <ChoiceGroup label="6. Độ đậm hương vị mong muốn" options={INTENSITY_OPTIONS} value={form.flavorIntensity} onChange={(value) => setForm((prev) => ({ ...prev, flavorIntensity: value }))} />,
            caffeinePreference: <ChoiceGroup label="7. Mức caffeine mong muốn" options={CAFFEINE_OPTIONS} value={form.caffeinePreference} onChange={(value) => setForm((prev) => ({ ...prev, caffeinePreference: value }))} />,
            drinkTime: <ChoiceGroup label="8. Thời điểm uống chính" options={DRINK_TIME_OPTIONS} value={form.drinkTime} onChange={(value) => setForm((prev) => ({ ...prev, drinkTime: value }))} />,
            ageGroup: <ChoiceGroup label="9. Nhóm tuổi" options={AGE_OPTIONS} value={form.ageGroup} onChange={(value) => setForm((prev) => ({ ...prev, ageGroup: value }))} />,
            lifestyle: <ChoiceGroup label="10. Lối sống thường ngày" options={LIFESTYLE_OPTIONS} value={form.lifestyle} onChange={(value) => setForm((prev) => ({ ...prev, lifestyle: value }))} />,
            allergies: <MultiChoiceGroup label="11. Dị ứng hoặc không hợp nguyên liệu nào?" options={ALLERGY_OPTIONS} values={form.allergies} onToggle={(value) => toggleValue('allergies', value)} />,
            avoid: <MultiChoiceGroup label="12. Nguyên liệu muốn tránh" options={AVOID_OPTIONS} values={form.avoid} onToggle={(value) => toggleValue('avoid', value)} />,
            otherRequest: <section className="rounded-[28px] border border-emerald-100/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(63,98,55,0.08)]"><label htmlFor="otherRequest" className="text-base font-extrabold text-gray-900">13. Yêu cầu khác bạn muốn ghi riêng</label><p className="mt-1 text-sm text-gray-500">Ví dụ: muốn vị thanh nhẹ, uống hằng ngày, ưu tiên dễ ngủ...</p><textarea id="otherRequest" rows="7" value={form.otherRequest} onChange={(e) => setForm((prev) => ({ ...prev, otherRequest: e.target.value }))} placeholder="Ghi yêu cầu cá nhân hóa của bạn tại đây..." className="mt-4 w-full px-4 py-3 rounded-3xl border border-emerald-100 bg-[#fbfff7] focus:outline-none focus:ring-2 focus:ring-emerald-200" /></section>,
        };
        return map[key] || null;
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f6faee] px-4 py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(177,213,126,0.35),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(241,211,147,0.32),transparent_30%),linear-gradient(180deg,#f8fbef_0%,#eef7e7_100%)]" />
            <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full border-[34px] border-emerald-200/30" />
            <div className="pointer-events-none absolute right-8 top-36 h-40 w-24 rotate-45 rounded-full bg-lime-200/40 blur-xl" />
            <div className="pointer-events-none absolute bottom-16 left-1/2 h-36 w-72 -translate-x-1/2 rounded-[100%] bg-amber-100/50 blur-2xl" />
            <div className="relative mx-auto max-w-6xl">
                <div className="mb-8 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-100 bg-white/85 text-emerald-800 text-sm font-extrabold shadow-sm"><span>🌿</span> AI Mix trà cá nhân hóa</span>
                    <h1 className="font-display-h1 mx-auto mt-5 max-w-4xl text-5xl text-[#27451f] sm:text-7xl">{isResultScreen ? 'Công thức trà từ thiên nhiên' : 'Mix trà theo nhịp sống khỏe'}</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-500 leading-7">{isResultScreen ? 'Công thức được AI tổng hợp từ toàn bộ câu trả lời của bạn.' : 'Trả lời lần lượt từng màn. Sau màn ghi chú cuối, hệ thống tổng hợp tất cả dữ liệu và gửi cho AI xử lý.'}</p>
                </div>

                {message && <div className="mb-5 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-2xl">{message}</div>}
                {error && <div className="mb-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl">{error}</div>}

                {!isResultScreen ? (
                    <form onSubmit={handleSubmit} className="rounded-[40px] border border-white/80 bg-white/75 p-5 sm:p-8 shadow-2xl shadow-emerald-100/50 backdrop-blur">
                        <div className="mb-7 grid gap-4 lg:grid-cols-[1fr_260px] lg:items-end">
                            <div>
                                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-700">Màn {activeScreen + 1}/{QUESTION_SCREENS.length} · {currentScreen.theme}</p>
                                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#263f21]">{currentScreen.title}</h2>
                                <p className="mt-2 text-gray-500">{currentScreen.description}</p>
                            </div>
                            <div className="rounded-3xl border border-emerald-100 bg-[#fbfff7] p-4">
                                <div className="flex justify-between text-xs font-bold text-gray-500"><span>Tiến độ</span><span>{progress}%</span></div>
                                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-lime-500 to-amber-300 transition-all duration-700" style={{ width: `${progress}%` }} /></div>
                            </div>
                        </div>

                        <div key={activeScreen} className={`grid gap-5 ${currentScreen.questions.length > 1 ? 'lg:grid-cols-2' : 'grid-cols-1'} transition-all duration-500 ease-out ${direction === 'forward' ? 'animate-[fadeIn_0.35s_ease-out]' : ''}`}>
                            {currentScreen.questions.map((questionKey) => <div key={questionKey}>{renderQuestion(questionKey)}</div>)}
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button type="button" onClick={prevScreen} disabled={activeScreen === 0 || loading} className="sm:w-44 rounded-2xl border border-gray-200 bg-white py-4 font-extrabold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">Quay lại</button>
                            <button type="submit" disabled={loading} className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-800 to-lime-600 py-4 font-extrabold text-white shadow-lg shadow-emerald-200 disabled:opacity-70">{activeScreen < QUESTION_SCREENS.length - 1 ? 'Sang màn tiếp theo' : loading ? 'Đang tổng hợp và gửi AI...' : 'Hoàn tất, gửi AI mix trà'}</button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <ResultSection result={result} />
                        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap gap-3">
                                <button type="button" onClick={restartQuestions} className="flex-1 min-w-[180px] py-4 rounded-2xl border border-gray-200 bg-white font-extrabold text-gray-800">Chỉnh câu hỏi</button>
                                <button type="button" onClick={saveRecipe} disabled={actionLoading === 'save'} className="flex-1 min-w-[180px] py-4 rounded-2xl border border-primary-100 bg-primary-50 font-extrabold text-primary-700 disabled:opacity-70">{actionLoading === 'save' ? 'Đang lưu...' : 'Lưu công thức'}</button>
                                <button type="button" onClick={buyNow} disabled={actionLoading === 'buy'} className="flex-1 min-w-[180px] py-4 rounded-2xl bg-emerald-900 font-extrabold text-white disabled:opacity-70">{actionLoading === 'buy' ? 'Đang thêm...' : 'Mua ngay'}</button>
                                <button type="button" onClick={submitRecipeForSale} disabled={actionLoading === 'submit'} className="flex-1 min-w-[220px] py-4 rounded-2xl border border-gray-200 bg-white font-extrabold text-gray-800 disabled:opacity-70">{actionLoading === 'submit' ? 'Đang gửi...' : 'Gửi admin duyệt bán'}</button>
                            </div>
                            {!user && <div className="mt-4 text-sm text-gray-500"><Link to="/login" className="text-primary-600 font-bold">Đăng nhập</Link> để lưu công thức, thêm vào giỏ hàng hoặc gửi công thức AI lên cửa hàng.</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIMixTea;