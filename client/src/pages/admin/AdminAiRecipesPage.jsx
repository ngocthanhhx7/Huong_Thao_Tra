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
    adminSelectClass,
    adminTextareaClass,
    formatCurrency,
    formatDateTime,
} from '../../components/admin/adminUtils';

const statusLabels = {
    draft: 'Bản nháp',
    saved: 'Đã lưu',
    submitted_for_sale: 'Chờ duyệt bán',
    approved_for_sale: 'Đã duyệt bán',
    rejected: 'Từ chối',
};

const statusTones = {
    draft: 'slate',
    saved: 'blue',
    submitted_for_sale: 'yellow',
    approved_for_sale: 'green',
    rejected: 'red',
};

const filters = [
    { value: 'submitted_for_sale', label: 'Chờ duyệt' },
    { value: 'all', label: 'Tất cả' },
    { value: 'approved_for_sale', label: 'Đã duyệt' },
    { value: 'saved', label: 'Đã lưu' },
];

const getIngredientName = (ingredient) => (typeof ingredient === 'object' ? ingredient.name : ingredient);

const AdminAiRecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [approvalDrafts, setApprovalDrafts] = useState({});
    const [filter, setFilter] = useState('submitted_for_sale');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [approvingId, setApprovingId] = useState('');

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/admin/ai-recipes');
            setRecipes(data || []);
            setApprovalDrafts(
                (data || []).reduce((acc, recipe) => {
                    acc[recipe._id] = {
                        price: recipe.pricingDraft?.price || 299000,
                        stock: recipe.pricingDraft?.stock || 10,
                        note: recipe.publishReview?.note || 'Approved in AI module',
                    };
                    return acc;
                }, {})
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải công thức AI.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const approveRecipe = async (id) => {
        try {
            setApprovingId(id);
            await api.post(`/admin/ai-recipes/${id}/approve`, approvalDrafts[id] || {});
            await fetchRecipes();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể duyệt công thức AI.');
        } finally {
            setApprovingId('');
        }
    };

    const filteredRecipes = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return recipes.filter((item) => {
            const matchesFilter = filter === 'all' || item.lifecycleStatus === filter;
            const ingredientText = (item.result?.ingredients || []).map(getIngredientName).join(' ').toLowerCase();
            const matchesSearch =
                !keyword ||
                item.result?.teaName?.toLowerCase().includes(keyword) ||
                item.user?.name?.toLowerCase().includes(keyword) ||
                ingredientText.includes(keyword);

            return matchesFilter && matchesSearch;
        });
    }, [filter, recipes, search]);

    const submittedCount = recipes.filter((item) => item.lifecycleStatus === 'submitted_for_sale').length;
    const approvedCount = recipes.filter((item) => item.lifecycleStatus === 'approved_for_sale').length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="AI Recipes"
                title="Duyệt công thức AI"
                description="Kiểm tra thành phần, định giá, đặt tồn kho và xuất bản công thức AI do khách gửi lên cửa hàng."
                meta={
                    <>
                        <StatusBadge tone="yellow">{submittedCount} chờ duyệt</StatusBadge>
                        <StatusBadge tone="green">{approvedCount} đã duyệt</StatusBadge>
                    </>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchRecipes} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard label="Tổng công thức" value={recipes.length} caption="Tất cả vòng đời" tone="purple" />
                <MetricCard label="Chờ duyệt bán" value={submittedCount} caption="Cần admin/staff xử lý" tone={submittedCount > 0 ? 'yellow' : 'slate'} />
                <MetricCard label="Đã duyệt" value={approvedCount} caption="Đã tạo sản phẩm trong catalog" tone="green" />
            </div>

            <AdminPanel
                title="Hàng chờ duyệt"
                description="Mặc định ưu tiên công thức đã gửi bán; có thể đổi sang tất cả để kiểm tra lịch sử."
                actions={
                    <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-[220px_180px]">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm công thức" className={adminInputClass} />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={adminSelectClass}>
                            {filters.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>
                }
            >
                {loading ? (
                    <LoadingState rows={4} />
                ) : filteredRecipes.length ? (
                    <div className="divide-y divide-slate-100">
                        {filteredRecipes.map((item) => {
                            const isSubmitted = item.lifecycleStatus === 'submitted_for_sale';
                            const ingredients = item.result?.ingredients || [];

                            return (
                                <div key={item._id} className="grid gap-5 py-5 first:pt-0 last:pb-0 2xl:grid-cols-[1fr_420px]">
                                    <div className="min-w-0 space-y-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-black text-slate-950">{item.result?.teaName || 'AI Recipe'}</h3>
                                            <StatusBadge tone={statusTones[item.lifecycleStatus] || 'slate'}>
                                                {statusLabels[item.lifecycleStatus] || item.lifecycleStatus}
                                            </StatusBadge>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            {item.user?.name || 'Khách hàng'} · {formatDateTime(item.updatedAt || item.createdAt)}
                                        </p>
                                        <p className="text-sm leading-6 text-slate-700">{item.result?.useCase || 'Chưa có mô tả công dụng.'}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {ingredients.slice(0, 8).map((ingredient, index) => (
                                                <StatusBadge key={`${getIngredientName(ingredient)}-${index}`} tone="slate">
                                                    {getIngredientName(ingredient)}
                                                </StatusBadge>
                                            ))}
                                            {ingredients.length > 8 && <StatusBadge tone="blue">+{ingredients.length - 8}</StatusBadge>}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 rounded-lg bg-slate-50 p-4">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <FormField label="Giá bán">
                                                <input
                                                    type="number"
                                                    value={approvalDrafts[item._id]?.price || 299000}
                                                    onChange={(e) => setApprovalDrafts((prev) => ({ ...prev, [item._id]: { ...prev[item._id], price: Number(e.target.value) } }))}
                                                    className={adminInputClass}
                                                />
                                            </FormField>
                                            <FormField label="Tồn kho">
                                                <input
                                                    type="number"
                                                    value={approvalDrafts[item._id]?.stock || 10}
                                                    onChange={(e) => setApprovalDrafts((prev) => ({ ...prev, [item._id]: { ...prev[item._id], stock: Number(e.target.value) } }))}
                                                    className={adminInputClass}
                                                />
                                            </FormField>
                                        </div>
                                        <FormField label="Ghi chú duyệt" hint={`Giá hiện tại: ${formatCurrency(approvalDrafts[item._id]?.price || 299000)}`}>
                                            <textarea
                                                value={approvalDrafts[item._id]?.note || ''}
                                                onChange={(e) => setApprovalDrafts((prev) => ({ ...prev, [item._id]: { ...prev[item._id], note: e.target.value } }))}
                                                className={adminTextareaClass}
                                            />
                                        </FormField>
                                        <AdminButton onClick={() => approveRecipe(item._id)} disabled={!isSubmitted || approvingId === item._id}>
                                            {isSubmitted ? 'Duyệt và tạo sản phẩm' : 'Đã qua bước duyệt'}
                                        </AdminButton>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        title="Không có công thức phù hợp"
                        description="Hàng chờ duyệt đang trống hoặc bộ lọc hiện tại không có dữ liệu."
                        action={<AdminButton variant="neutral" onClick={() => { setFilter('all'); setSearch(''); }}>Xem tất cả</AdminButton>}
                    />
                )}
            </AdminPanel>
        </div>
    );
};

export default AdminAiRecipesPage;
