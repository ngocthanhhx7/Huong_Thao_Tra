import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const GOAL_OPTIONS = ['Giảm căng thẳng', 'Ngủ ngon hơn', 'Thanh nhiệt', 'Tiêu hóa nhẹ bụng', 'Dưỡng nhan', 'Làm ấm cơ thể'];
const SYMPTOM_OPTIONS = ['Hay căng thẳng', 'Khó ngủ', 'Mệt mỏi', 'Đầy bụng', 'Nóng trong', 'Khó tập trung', 'Khô họng', 'Muốn detox nhẹ'];
const STRESS_OPTIONS = ['Thấp', 'Trung bình', 'Cao'];
const SLEEP_OPTIONS = ['Ngủ tốt', 'Ngủ bình thường', 'Khó ngủ'];
const FLAVOR_OPTIONS = ['Hương hoa', 'Trái cây', 'Thanh mát', 'Ấm cay', 'Ngọt dịu'];
const CAFFEINE_OPTIONS = ['Không caffeine', 'Ít caffeine', 'Caffeine vừa'];
const DRINK_TIME_OPTIONS = ['Buổi sáng', 'Buổi trưa', 'Buổi chiều', 'Buổi tối'];
const AGE_OPTIONS = ['Dưới 18', '18-30', '31-50', 'Trên 50'];
const ALLERGY_OPTIONS = ['Không có', 'Hoa cúc', 'Hoa hồng', 'Gừng', 'Cam thảo', 'Bạc hà'];
const AVOID_OPTIONS = ['Hoa cúc vàng', 'Hoa hồng', 'Kỷ tử', 'Táo đỏ', 'Long nhãn Hưng Yên', 'Gừng sấy khô thái lát', 'Hoa atiso', 'Lá bạc hà khô', 'Quế Thanh', 'Cỏ ngọt'];

const initialForm = {
    goal: 'Giảm căng thẳng',
    symptoms: ['Hay căng thẳng'],
    stressLevel: 'Trung bình',
    sleepQuality: 'Ngủ bình thường',
    flavorPreference: 'Hương hoa',
    caffeinePreference: 'Không caffeine',
    drinkTime: 'Buổi tối',
    ageGroup: '18-30',
    allergies: ['Không có'],
    avoid: [],
    otherRequest: '',
};

const ChoiceGroup = ({ label, options, value, onChange }) => (
    <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <div className="flex flex-wrap gap-3">
            {options.map((option) => {
                const active = value === option;

                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`px-4 py-2.5 rounded-full border text-sm font-semibold transition ${
                            active
                                ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                        }`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    </div>
);

ChoiceGroup.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const MultiChoiceGroup = ({ label, options, values, onToggle }) => (
    <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <div className="flex flex-wrap gap-3">
            {options.map((option) => {
                const active = values.includes(option);

                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onToggle(option)}
                        className={`px-4 py-2.5 rounded-full border text-sm font-semibold transition ${
                            active
                                ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    </div>
);

MultiChoiceGroup.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggle: PropTypes.func.isRequired,
};

const ResultSection = ({ result }) => {
    if (!result) {
        return (
            <div className="bg-white rounded-[32px] border border-dashed border-gray-300 min-h-[540px] flex items-center justify-center p-10 text-gray-400 text-center">
                Kết quả công thức AI sẽ xuất hiện tại đây sau khi bạn hoàn tất khảo sát nhanh.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-primary-600 font-semibold">Công thức gợi ý</p>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-2">{result.teaName}</h2>
                <p className="text-gray-600 mt-3 leading-7">{result.useCase}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-primary-50 border border-primary-100 p-5">
                    <p className="text-sm font-semibold text-primary-700 mb-3">Nguyên liệu chính</p>
                    <div className="space-y-2 text-sm text-gray-700">
                        {(result.ingredients || []).map((item, index) => (
                            <div key={`${typeof item === 'object' ? item.name : item}-${index}`} className="flex justify-between gap-3">
                                <span className="font-medium">{typeof item === 'object' ? item.name : item}</span>
                                <span className="text-gray-500 text-right">{typeof item === 'object' ? item.amount : ''}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl bg-gray-50 border border-gray-100 p-5 space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Tỷ lệ phối</p>
                        <p className="text-gray-600 mt-1">{result.ratio}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Tần suất dùng</p>
                        <p className="text-gray-600 mt-1">{result.frequency}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-gray-100 p-5">
                    <p className="text-sm font-semibold text-gray-800 mb-3">Lợi ích nổi bật</p>
                    <div className="flex flex-wrap gap-2">
                        {(result.benefits || []).map((benefit) => (
                            <span key={benefit} className="px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                                {benefit}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-100 p-5">
                    <p className="text-sm font-semibold text-gray-800 mb-3">Lưu ý</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                        {(result.warnings || []).length > 0 ? (
                            result.warnings.map((warning) => <li key={warning}>{warning}</li>)
                        ) : (
                            <li>Không có lưu ý đặc biệt từ AI cho lựa chọn này.</li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="rounded-3xl border border-gray-100 p-5">
                <p className="text-sm font-semibold text-gray-800 mb-3">Cách pha gợi ý</p>
                <ol className="space-y-3 text-gray-600">
                    {(result.brewSteps || []).map((step, index) => (
                        <li key={`${step}-${index}`} className="flex gap-3">
                            <span className="h-7 w-7 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                                {index + 1}
                            </span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

ResultSection.propTypes = {
    result: PropTypes.shape({
        teaName: PropTypes.string,
        useCase: PropTypes.string,
        ratio: PropTypes.string,
        frequency: PropTypes.string,
        ingredients: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.shape({
                    name: PropTypes.string,
                    amount: PropTypes.string,
                    role: PropTypes.string,
                }),
            ])
        ),
        benefits: PropTypes.arrayOf(PropTypes.string),
        warnings: PropTypes.arrayOf(PropTypes.string),
        brewSteps: PropTypes.arrayOf(PropTypes.string),
    }),
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

    const toggleValue = (field, option) => {
        setForm((prev) => {
            const currentValues = prev[field];
            const isNoOption = option === 'Không có';
            const hasValue = currentValues.includes(option);

            if (isNoOption) {
                return { ...prev, [field]: hasValue ? [] : ['Không có'] };
            }

            const baseValues = currentValues.filter((item) => item !== 'Không có');
            return {
                ...prev,
                [field]: hasValue ? baseValues.filter((item) => item !== option) : [...baseValues, option],
            };
        });
    };

    const buildInputParams = () => ({
        goal: form.goal,
        symptoms: form.symptoms,
        stressLevel: form.stressLevel,
        sleepQuality: form.sleepQuality,
        flavorPreference: form.flavorPreference,
        caffeinePreference: form.caffeinePreference,
        drinkTime: form.drinkTime,
        ageGroup: form.ageGroup,
        allergies: form.allergies.filter((item) => item !== 'Không có'),
        avoid: form.avoid,
        otherRequest: form.otherRequest,
    });

    const ensureLoggedIn = () => {
        if (user) {
            return true;
        }

        setError('Bạn cần đăng nhập để lưu, gửi duyệt bán hoặc mua ngay công thức AI.');
        return false;
    };

    const persistRecipe = async () => {
        const saveRes = await api.post('/ai/mix-tea/save', {
            result,
            inputParams: buildInputParams(),
            suggestionId: savedSuggestionId || undefined,
        });

        setSavedSuggestionId(saveRes.data._id);
        return saveRes.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await api.post('/ai/mix-tea', buildInputParams());
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Tạo công thức trà thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const saveRecipe = async () => {
        if (!result || !ensureLoggedIn()) {
            return;
        }

        setActionLoading('save');
        setError('');
        setMessage('');

        try {
            await persistRecipe();
            setMessage('Công thức đã được lưu vào lịch sử AI của bạn. Bạn vẫn có thể tiếp tục mua hoặc gửi duyệt bán.');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lưu công thức AI.');
        } finally {
            setActionLoading('');
        }
    };

    const submitRecipeForSale = async () => {
        if (!result || !ensureLoggedIn()) {
            return;
        }

        setActionLoading('submit');
        setError('');
        setMessage('');

        try {
            const suggestion = savedSuggestionId ? { _id: savedSuggestionId } : await persistRecipe();
            const submitRes = await api.post(`/ai/mix-tea/${suggestion._id}/submit-for-sale`, {
                price: 299000,
                stock: 10,
                image: '',
            });

            setSavedSuggestionId(submitRes.data.suggestion?._id || suggestion._id);
            setMessage('Công thức đã được gửi cho admin/staff duyệt. Ảnh mặc định của trà AI cũng đã được gắn sẵn.');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể gửi công thức AI để duyệt bán.');
        } finally {
            setActionLoading('');
        }
    };

    const buyNow = async () => {
        if (!result || !ensureLoggedIn()) {
            return;
        }

        setActionLoading('buy');
        setError('');
        setMessage('');

        try {
            const res = await api.post('/ai/mix-tea/buy-now', {
                result,
                inputParams: buildInputParams(),
                suggestionId: savedSuggestionId || undefined,
            });

            setSavedSuggestionId(res.data.suggestion?._id || savedSuggestionId);
            setMessage('Công thức đã được giữ lại và thêm ngay vào giỏ hàng của bạn.');
            navigate('/cart');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể thêm công thức AI vào giỏ hàng.');
        } finally {
            setActionLoading('');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1fr] gap-8 items-start">
                <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-gray-100 p-8 space-y-8">
                    <div>
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold">
                            Survey chọn nhanh
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mt-5">AI Pha Trà Thảo Mộc</h1>
                        <p className="text-gray-500 mt-4 leading-7">
                            Mình đã chuyển form này sang kiểu chọn option để khách hàng bấm nhanh hơn. Bạn chỉ cần chọn các nhu cầu chính, còn phần nhập tay chỉ giữ lại mục yêu cầu khác.
                        </p>
                    </div>

                    {message && <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-2xl">{message}</div>}
                    {error && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl">{error}</div>}

                    <ChoiceGroup label="Bạn muốn trà hỗ trợ điều gì nhất?" options={GOAL_OPTIONS} value={form.goal} onChange={(value) => setForm((prev) => ({ ...prev, goal: value }))} />
                    <MultiChoiceGroup label="Triệu chứng hoặc cảm giác hiện tại" options={SYMPTOM_OPTIONS} values={form.symptoms} onToggle={(value) => toggleValue('symptoms', value)} />
                    <ChoiceGroup label="Mức độ căng thẳng" options={STRESS_OPTIONS} value={form.stressLevel} onChange={(value) => setForm((prev) => ({ ...prev, stressLevel: value }))} />
                    <ChoiceGroup label="Chất lượng giấc ngủ" options={SLEEP_OPTIONS} value={form.sleepQuality} onChange={(value) => setForm((prev) => ({ ...prev, sleepQuality: value }))} />
                    <ChoiceGroup label="Gu vị bạn thích" options={FLAVOR_OPTIONS} value={form.flavorPreference} onChange={(value) => setForm((prev) => ({ ...prev, flavorPreference: value }))} />
                    <ChoiceGroup label="Mức caffeine mong muốn" options={CAFFEINE_OPTIONS} value={form.caffeinePreference} onChange={(value) => setForm((prev) => ({ ...prev, caffeinePreference: value }))} />
                    <ChoiceGroup label="Thời điểm uống chính" options={DRINK_TIME_OPTIONS} value={form.drinkTime} onChange={(value) => setForm((prev) => ({ ...prev, drinkTime: value }))} />
                    <ChoiceGroup label="Nhóm tuổi" options={AGE_OPTIONS} value={form.ageGroup} onChange={(value) => setForm((prev) => ({ ...prev, ageGroup: value }))} />
                    <MultiChoiceGroup label="Dị ứng hoặc không hợp nguyên liệu nào?" options={ALLERGY_OPTIONS} values={form.allergies} onToggle={(value) => toggleValue('allergies', value)} />
                    <MultiChoiceGroup label="Nguyên liệu muốn tránh" options={AVOID_OPTIONS} values={form.avoid} onToggle={(value) => toggleValue('avoid', value)} />

                    <div className="space-y-3">
                        <label htmlFor="otherRequest" className="text-sm font-semibold text-gray-700">
                            Yêu cầu khác
                        </label>
                        <textarea
                            id="otherRequest"
                            rows="4"
                            value={form.otherRequest}
                            onChange={(e) => setForm((prev) => ({ ...prev, otherRequest: e.target.value }))}
                            placeholder="Ví dụ: mình muốn vị thanh nhẹ, uống hằng ngày, ưu tiên nguyên liệu dễ ngủ..."
                            className="w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-2xl font-bold shadow-sm disabled:opacity-70"
                    >
                        {loading ? 'AI đang tạo công thức...' : 'Tạo công thức AI'}
                    </button>
                </form>

                <div className="space-y-6">
                    <ResultSection result={result} />

                    {result && (
                        <div className="bg-white rounded-[32px] border border-gray-100 p-6 space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={saveRecipe}
                                    disabled={actionLoading === 'save'}
                                    className="flex-1 min-w-[180px] py-4 rounded-2xl border border-primary-100 bg-primary-50 font-bold text-primary-700 disabled:opacity-70"
                                >
                                    {actionLoading === 'save' ? 'Đang lưu...' : 'Lưu công thức'}
                                </button>
                                <button
                                    type="button"
                                    onClick={buyNow}
                                    disabled={actionLoading === 'buy'}
                                    className="flex-1 min-w-[180px] py-4 rounded-2xl bg-gray-900 font-bold text-white disabled:opacity-70"
                                >
                                    {actionLoading === 'buy' ? 'Đang thêm vào giỏ...' : 'Mua ngay'}
                                </button>
                                <button
                                    type="button"
                                    onClick={submitRecipeForSale}
                                    disabled={actionLoading === 'submit'}
                                    className="flex-1 min-w-[220px] py-4 rounded-2xl border border-gray-200 bg-white font-bold text-gray-800 disabled:opacity-70"
                                >
                                    {actionLoading === 'submit' ? 'Đang gửi duyệt...' : 'Gửi admin duyệt bán'}
                                </button>
                            </div>

                            <div className="rounded-3xl bg-amber-50 border border-amber-100 px-4 py-4 text-sm text-amber-800 leading-6">
                                Khi bạn bấm <strong>Mua ngay</strong> hoặc <strong>Lưu công thức</strong>, hệ thống sẽ giữ lại công thức hiện tại của bạn thay vì xoá lựa chọn.
                            </div>

                            {!user && (
                                <div className="text-sm text-gray-500">
                                    <Link to="/login" className="text-primary-600 font-bold">Đăng nhập</Link> để lưu công thức, thêm vào giỏ hàng hoặc gửi công thức AI lên cửa hàng.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIMixTea;
