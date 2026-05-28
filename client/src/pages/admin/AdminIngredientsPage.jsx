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
    formatCurrency,
} from '../../components/admin/adminUtils';

const AdminIngredientsPage = () => {
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingId, setSavingId] = useState('');

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/admin/ingredients');
            setIngredients(data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải nguyên liệu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const updateIngredientField = (id, patch) => {
        setIngredients((prev) => prev.map((item) => (item._id === id ? { ...item, ...patch } : item)));
    };

    const updateIngredient = async (ingredient) => {
        try {
            setSavingId(ingredient._id);
            await api.patch(`/admin/ingredients/${ingredient._id}`, {
                name: ingredient.name,
                description: ingredient.description,
                pricePerGram: ingredient.pricePerGram,
            });
            await fetchIngredients();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lưu nguyên liệu.');
        } finally {
            setSavingId('');
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

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Ingredients"
                title="Quản lý nguyên liệu"
                description="Chuẩn hóa tên, mô tả và giá theo gram để AI recipe và catalog dùng cùng một nguồn dữ liệu."
                meta={<StatusBadge tone="green">{ingredients.length} nguyên liệu</StatusBadge>}
            />

            {error && <ErrorState message={error} onRetry={fetchIngredients} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard label="Tổng nguyên liệu" value={ingredients.length} caption="Trong catalog pha trà" tone="green" />
                <MetricCard label="Đã có giá" value={pricedCount} caption="Có thể tính cost" tone="purple" />
                <MetricCard label="Giá TB/gram" value={formatCurrency(averagePrice)} caption="Theo dữ liệu hiện tại" tone="yellow" />
            </div>

            <AdminPanel
                title="Danh sách nguyên liệu"
                description="Sửa trực tiếp từng dòng rồi lưu để cập nhật API."
                actions={<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm nguyên liệu" className={`${adminInputClass} w-full sm:w-[260px]`} />}
            >
                {loading ? (
                    <LoadingState rows={5} />
                ) : filteredIngredients.length ? (
                    <div className="divide-y divide-slate-100">
                        {filteredIngredients.map((ingredient) => (
                            <div key={ingredient._id} className="grid gap-4 py-5 first:pt-0 last:pb-0 xl:grid-cols-[1fr_1.4fr_180px_96px] xl:items-end">
                                <FormField label="Tên nguyên liệu">
                                    <input value={ingredient.name || ''} onChange={(e) => updateIngredientField(ingredient._id, { name: e.target.value })} className={adminInputClass} />
                                </FormField>
                                <FormField label="Mô tả">
                                    <input value={ingredient.description || ''} onChange={(e) => updateIngredientField(ingredient._id, { description: e.target.value })} className={adminInputClass} />
                                </FormField>
                                <FormField label="Giá/gram">
                                    <input
                                        type="number"
                                        value={ingredient.pricePerGram || 0}
                                        onChange={(e) => updateIngredientField(ingredient._id, { pricePerGram: Number(e.target.value) })}
                                        className={adminInputClass}
                                    />
                                </FormField>
                                <AdminButton onClick={() => updateIngredient(ingredient)} disabled={savingId === ingredient._id}>
                                    Lưu
                                </AdminButton>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Không có nguyên liệu phù hợp"
                        description="Thử tìm bằng tên hoặc mô tả khác."
                        action={<AdminButton variant="neutral" onClick={() => setSearch('')}>Xóa tìm kiếm</AdminButton>}
                    />
                )}
            </AdminPanel>
        </div>
    );
};

export default AdminIngredientsPage;
