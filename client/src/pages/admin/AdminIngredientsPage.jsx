import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import {
    AdminButton,
    AdminPageHeader,
    AdminPanel,
    EmptyState,
    ErrorState,
    FormField,
    LoadingState,
    MetricCard,
    StatusBadge,
} from '../../components/admin/AdminUi';
import {
    adminInputClass,
    adminTextareaClass,
    formatCurrency,
} from '../../components/admin/adminUtils';
import AdminImageUploadField from '../../components/admin/AdminImageUploadField';

const emptyIngredient = {
    name: '',
    description: '',
    pricePerGram: 0,
    image: '',
    appearance: '',
    identification: '',
    precautions: '',
    caffeine: false,
    benefits: '',
    benefitsDetail: '',
    isUsedInAIMix: true,
};

const AdminIngredientsPage = () => {
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'ai-mix'

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [ingredientForm, setIngredientForm] = useState(emptyIngredient);
    const [submitting, setSubmitting] = useState(false);

    // AI Config State
    const [aiConfig, setAiConfig] = useState({ systemInstruction: '', formulaRules: '' });
    const [loadingConfig, setLoadingConfig] = useState(false);
    const [savingConfig, setSavingConfig] = useState(false);

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/admin/ingredients');
            setIngredients(data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách nguyên liệu.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAiConfig = async () => {
        try {
            setLoadingConfig(true);
            const { data } = await api.get('/admin/ai-mix-config');
            setAiConfig(data || { systemInstruction: '', formulaRules: '' });
        } catch (err) {
            console.error('Failed to load AI mix config', err);
        } finally {
            setLoadingConfig(false);
        }
    };

    useEffect(() => {
        fetchIngredients();
        fetchAiConfig();
    }, []);

    const handleOpenCreateModal = () => {
        setModalMode('create');
        setIngredientForm(emptyIngredient);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (ingredient) => {
        setModalMode('edit');
        setIngredientForm({
            ...ingredient,
            benefits: Array.isArray(ingredient.benefits) ? ingredient.benefits.join(', ') : ingredient.benefits || '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIngredientForm(emptyIngredient);
    };

    const handleSaveIngredient = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const benefitsArray = typeof ingredientForm.benefits === 'string'
                ? ingredientForm.benefits.split(',').map((b) => b.trim()).filter(Boolean)
                : ingredientForm.benefits;

            const payload = {
                ...ingredientForm,
                benefits: benefitsArray,
            };

            if (modalMode === 'create') {
                await api.post('/admin/ingredients', payload);
            } else {
                await api.patch(`/admin/ingredients/${ingredientForm._id}`, payload);
            }

            handleCloseModal();
            fetchIngredients();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi lưu nguyên liệu.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteIngredient = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa nguyên liệu "${name}"? Thao tác này sẽ tự động gỡ bỏ nguyên liệu này khỏi tất cả các sản phẩm trà đang liên kết.`)) {
            return;
        }

        try {
            setLoading(true);
            await api.delete(`/admin/ingredients/${id}`);
            fetchIngredients();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xóa nguyên liệu.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAiConfig = async (e) => {
        e.preventDefault();
        try {
            setSavingConfig(true);
            await api.patch('/admin/ai-mix-config', aiConfig);
            alert('Lưu cấu hình AI Mix thành công!');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lưu cấu hình AI.');
        } finally {
            setSavingConfig(false);
        }
    };

    const handleQuickToggleAiMix = async (id, currentStatus) => {
        try {
            // Optimistic update
            setIngredients((prev) =>
                prev.map((item) => (item._id === id ? { ...item, isUsedInAIMix: !currentStatus } : item))
            );
            await api.patch(`/admin/ingredients/${id}`, { isUsedInAIMix: !currentStatus });
        } catch (err) {
            console.error('Failed to toggle AI Mix selection', err);
            fetchIngredients(); // Rollback
        }
    };

    const filteredIngredients = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) {
            return ingredients;
        }

        return ingredients.filter((ingredient) =>
            `${ingredient.name || ''} ${ingredient.description || ''}`.toLowerCase().includes(keyword)
        );
    }, [ingredients, search]);

    const pricedCount = ingredients.filter((ingredient) => Number(ingredient.pricePerGram || 0) > 0).length;
    const averagePrice =
        pricedCount > 0
            ? ingredients.reduce((sum, ingredient) => sum + Number(ingredient.pricePerGram || 0), 0) / pricedCount
            : 0;

    const aiMixActiveCount = ingredients.filter((ingredient) => ingredient.isUsedInAIMix).length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Ingredients Catalog"
                title="Quản lý trà liệu & AI Mix"
                description="Thiết lập nguyên liệu thảo mộc tự nhiên, cấu hình công thức phối trộn và quản trị các chỉ dẫn AI."
                meta={
                    <div className="flex gap-2">
                        <StatusBadge tone="green">{ingredients.length} nguyên liệu</StatusBadge>
                        <StatusBadge tone="blue">{aiMixActiveCount} AI Active</StatusBadge>
                    </div>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchIngredients} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard label="Tổng nguyên liệu" value={ingredients.length} caption="Đang lưu trong hệ thống" tone="green" />
                <MetricCard label="Nguyên liệu AI Mix" value={aiMixActiveCount} caption="Được cho phép phối trộn" tone="teal" />
                <MetricCard label="Giá TB/gram" value={formatCurrency(averagePrice)} caption="Theo dữ liệu trà liệu" tone="yellow" />
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`py-3 px-6 text-sm font-black border-b-2 transition-colors ${
                        activeTab === 'list'
                            ? 'border-primary-600 text-primary-700'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Danh sách Nguyên liệu
                </button>
                <button
                    onClick={() => setActiveTab('ai-config')}
                    className={`py-3 px-6 text-sm font-black border-b-2 transition-colors ${
                        activeTab === 'ai-config'
                            ? 'border-primary-600 text-primary-700'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Cấu hình AI Mix Trà
                </button>
            </div>

            {/* Tab 1: Ingredients List CRUD */}
            {activeTab === 'list' && (
                <AdminPanel
                    title="Danh sách nguyên liệu thảo mộc"
                    description="Thêm, sửa đổi các thuộc tính hình ảnh, nhận biết, công dụng chi tiết của nguyên liệu."
                    actions={
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm nguyên liệu..."
                                className={`${adminInputClass} w-full sm:w-[260px]`}
                            />
                            <AdminButton variant="primary" onClick={handleOpenCreateModal}>
                                ＋ Thêm nguyên liệu
                            </AdminButton>
                        </div>
                    }
                >
                    {loading ? (
                        <LoadingState rows={5} />
                    ) : filteredIngredients.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <th className="py-3 px-4">Ảnh/Tên</th>
                                        <th className="py-3 px-4">Mô tả</th>
                                        <th className="py-3 px-4">Giá/gram</th>
                                        <th className="py-3 px-4">Caffeine</th>
                                        <th className="py-3 px-4">AI Mix</th>
                                        <th className="py-3 px-4 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredIngredients.map((ingredient) => (
                                        <tr key={ingredient._id} className="hover:bg-slate-50/50">
                                            <td className="py-4 px-4 font-bold text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    {ingredient.image ? (
                                                        <img src={ingredient.image} alt={ingredient.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">🌿</div>
                                                    )}
                                                    <div>
                                                        <span className="block font-black text-slate-950">{ingredient.name}</span>
                                                        {ingredient.benefits && ingredient.benefits.length > 0 && (
                                                            <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                                                                {ingredient.benefits.slice(0, 1)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-slate-600 max-w-[280px] truncate">{ingredient.description || 'Chưa có mô tả'}</td>
                                            <td className="py-4 px-4 font-extrabold text-slate-800">{formatCurrency(ingredient.pricePerGram || 0)}</td>
                                            <td className="py-4 px-4">
                                                {ingredient.caffeine ? (
                                                    <span className="text-amber-700 bg-amber-50 border border-amber-100 text-[11px] font-bold px-2 py-0.5 rounded-full">Có</span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={!!ingredient.isUsedInAIMix}
                                                    onChange={() => handleQuickToggleAiMix(ingredient._id, ingredient.isUsedInAIMix)}
                                                    className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                                                />
                                            </td>
                                            <td className="py-4 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(ingredient)}
                                                    className="text-primary-700 hover:text-primary-900 font-extrabold text-xs"
                                                >
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteIngredient(ingredient._id, ingredient.name)}
                                                    className="text-red-600 hover:text-red-800 font-extrabold text-xs"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState
                            title="Không có nguyên liệu thảo mộc"
                            description="Thêm nguyên liệu mới để hiển thị trong bách khoa trà liệu và catalog trà."
                            action={<AdminButton variant="primary" onClick={handleOpenCreateModal}>Thêm nguyên liệu đầu tiên</AdminButton>}
                        />
                    )}
                </AdminPanel>
            )}

            {/* Tab 2: AI Config Settings */}
            {activeTab === 'ai-config' && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
                    {/* Left Panel: Instructions edit */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Cấu hình mô-đun AI Mix Trà</h3>
                            <p className="text-slate-500 text-xs mt-1">Điều chỉnh prompt chỉ dẫn hệ thống của Gemini và luật tạo công thức.</p>
                        </div>
                        {loadingConfig ? (
                            <LoadingState rows={3} />
                        ) : (
                            <form onSubmit={handleSaveAiConfig} className="space-y-6">
                                <FormField
                                    label="System Instruction (Chỉ dẫn hệ thống của chuyên gia)"
                                    hint="Xác định vai trò, nguồn kiến thức và phong cách tư vấn của chuyên gia AI."
                                >
                                    <textarea
                                        rows={8}
                                        value={aiConfig.systemInstruction}
                                        onChange={(e) => setAiConfig((prev) => ({ ...prev, systemInstruction: e.target.value }))}
                                        className={`${adminTextareaClass} text-sm`}
                                        placeholder="Bạn là chuyên gia thảo mộc..."
                                        required
                                    />
                                </FormField>

                                <FormField
                                    label="Formula Rules (Quy tắc công thức phối trộn)"
                                    hint="Quy định cấu trúc phối trộn (Core, Support, Flavor herbs) để AI xuất ra JSON chuẩn xác."
                                >
                                    <textarea
                                        rows={8}
                                        value={aiConfig.formulaRules}
                                        onChange={(e) => setAiConfig((prev) => ({ ...prev, formulaRules: e.target.value }))}
                                        className={`${adminTextareaClass} text-sm`}
                                        placeholder="LOGIC TẠO CÔNG THỨC TRÀ:..."
                                        required
                                    />
                                </FormField>

                                <div className="pt-4 border-t border-slate-100 flex justify-end">
                                    <AdminButton type="submit" variant="primary" disabled={savingConfig}>
                                        {savingConfig ? 'Đang lưu cấu hình...' : 'Lưu cấu hình AI Mix'}
                                    </AdminButton>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Right Panel: Quick toggle active ingredients */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div>
                            <h4 className="font-black text-slate-950 text-base">Thảo mộc trong AI Mix</h4>
                            <p className="text-slate-500 text-xs mt-1">Tích chọn để cho phép AI lựa chọn nguyên liệu này khi phối trộn công thức trà.</p>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 pr-2">
                            {ingredients.map((ing) => (
                                <label key={ing._id} className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors">
                                    <div className="flex items-center gap-2">
                                        {ing.image ? (
                                            <img src={ing.image} alt="" className="w-7 h-7 rounded object-cover" />
                                        ) : (
                                            <span className="text-sm">🌿</span>
                                        )}
                                        <span className="text-sm font-extrabold text-slate-800">{ing.name}</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={!!ing.isUsedInAIMix}
                                        onChange={() => handleQuickToggleAiMix(ing._id, ing.isUsedInAIMix)}
                                        className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CRUD Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-soft-rise max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900">
                                {modalMode === 'create' ? 'Thêm nguyên liệu thảo mộc mới' : `Sửa nguyên liệu "${ingredientForm.name}"`}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSaveIngredient} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Tên nguyên liệu *" hint="Tên phổ thông (ví dụ: Hoa cúc trắng)">
                                    <input
                                        value={ingredientForm.name}
                                        onChange={(e) => setIngredientForm((p) => ({ ...p, name: e.target.value }))}
                                        className={adminInputClass}
                                        required
                                    />
                                </FormField>
                                <FormField label="Giá tham khảo / gram (VNĐ) *" hint="Đặt 0 nếu là nguyên liệu liên kết phi thương mại">
                                    <input
                                        type="number"
                                        value={ingredientForm.pricePerGram}
                                        onChange={(e) => setIngredientForm((p) => ({ ...p, pricePerGram: Number(e.target.value) }))}
                                        className={adminInputClass}
                                        required
                                    />
                                </FormField>
                            </div>

                            <AdminImageUploadField
                                label="Ảnh nguyên liệu"
                                hint="Dán URL hiện có hoặc chọn file cận cảnh thảo mộc để upload lên S3."
                                value={ingredientForm.image}
                                folder="ingredients"
                                onChange={(url) => setIngredientForm((p) => ({ ...p, image: url }))}
                            />

                            <FormField label="Mô tả khái quát ngắn" hint="Tóm tắt đặc điểm trong 1-2 câu ngắn">
                                <input
                                    value={ingredientForm.description}
                                    onChange={(e) => setIngredientForm((p) => ({ ...p, description: e.target.value }))}
                                    className={adminInputClass}
                                    placeholder="Linh chi khô giúp bồi bổ khí huyết, an thần..."
                                />
                            </FormField>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Lợi ích tóm tắt (benefits)" hint="Các từ khóa ngắn ngăn cách bởi dấu phẩy">
                                    <input
                                        value={ingredientForm.benefits}
                                        onChange={(e) => setIngredientForm((p) => ({ ...p, benefits: e.target.value }))}
                                        className={adminInputClass}
                                        placeholder="Giảm căng thẳng, Ngủ ngon, Đẹp da"
                                    />
                                </FormField>
                                <div className="flex items-center gap-6 mt-6 md:mt-8 pl-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={ingredientForm.caffeine}
                                            onChange={(e) => setIngredientForm((p) => ({ ...p, caffeine: e.target.checked }))}
                                            className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                                        />
                                        <span className="font-extrabold text-slate-800">Có Caffeine</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={ingredientForm.isUsedInAIMix}
                                            onChange={(e) => setIngredientForm((p) => ({ ...p, isUsedInAIMix: e.target.checked }))}
                                            className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                                        />
                                        <span className="font-extrabold text-slate-800">Cho phép AI Mix</span>
                                    </label>
                                </div>
                            </div>

                            <FormField label="Mô tả chi tiết công dụng (Paragraph/Rich Text)" hint="Viết chi tiết, tự do về công dụng dược lý, trị liệu của thảo mộc.">
                                <textarea
                                    rows={4}
                                    value={ingredientForm.benefitsDetail}
                                    onChange={(e) => setIngredientForm((p) => ({ ...p, benefitsDetail: e.target.value }))}
                                    className={adminTextareaClass}
                                    placeholder="Thảo dược linh chi có chứa hoạt chất triterpenoid giúp điều hòa huyết áp..."
                                />
                            </FormField>

                            <FormField label="Đặc điểm ngoại hình (Appearance)" hint="Chi tiết về hình dáng, lá, hoa, rễ hoặc dạng sấy khô.">
                                <textarea
                                    rows={3}
                                    value={ingredientForm.appearance}
                                    onChange={(e) => setIngredientForm((p) => ({ ...p, appearance: e.target.value }))}
                                    className={adminTextareaClass}
                                    placeholder="Hoa cúc có màu vàng tươi nhạt, cánh mỏng xếp đều, khi sấy khô có mùi thơm nồng đặc trưng..."
                                />
                            </FormField>

                            <FormField label="Cách phân biệt (Identification)" hint="Nhận diện chất lượng thật/giả hoặc các loại thảo mộc kém chất lượng.">
                                <textarea
                                    rows={3}
                                    value={ingredientForm.identification}
                                    onChange={(e) => setIngredientForm((p) => ({ ...p, identification: e.target.value }))}
                                    className={adminTextareaClass}
                                    placeholder="Thảo mộc thật có mùi thơm thảo mộc tự nhiên dịu nhẹ. Hàng tẩm ướp chất bảo quản sẽ có mùi hắc diêm sinh..."
                                />
                            </FormField>

                            <FormField label="Lưu ý khi phối trộn và pha chế (Precautions)" hint="Chống chỉ định cho thai phụ, trẻ em hoặc các lưu ý khác.">
                                <textarea
                                    rows={3}
                                    value={ingredientForm.precautions}
                                    onChange={(e) => setIngredientForm((p) => ({ ...p, precautions: e.target.value }))}
                                    className={adminTextareaClass}
                                    placeholder="Không dùng quá 15g một ngày. Cần lưu ý khi phối trộn với các thảo mộc chứa lượng lớn tannin..."
                                />
                            </FormField>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <AdminButton type="button" variant="neutral" onClick={handleCloseModal}>
                                    Hủy
                                </AdminButton>
                                <AdminButton type="submit" variant="primary" disabled={submitting}>
                                    {submitting ? 'Đang lưu...' : 'Lưu nguyên liệu'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminIngredientsPage;
