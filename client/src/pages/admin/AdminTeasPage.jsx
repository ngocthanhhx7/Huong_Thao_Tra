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
    formatCurrency,
} from '../../components/admin/adminUtils';

const AdminTeasPage = () => {
    const [teas, setTeas] = useState([]);
    const [search, setSearch] = useState('');
    const [publishFilter, setPublishFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingId, setSavingId] = useState('');

    const fetchTeas = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/admin/teas');
            setTeas(data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải sản phẩm trà.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeas();
    }, []);

    const updateTeaField = (id, patch) => {
        setTeas((prev) => prev.map((item) => (item._id === id ? { ...item, ...patch } : item)));
    };

    const updateTea = async (tea) => {
        try {
            setSavingId(tea._id);
            await api.patch(`/admin/teas/${tea._id}`, {
                name: tea.name,
                image: tea.image,
                price: tea.price,
                stock: tea.stock,
                isPublished: tea.isPublished,
            });
            await fetchTeas();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lưu sản phẩm trà.');
        } finally {
            setSavingId('');
        }
    };

    const filteredTeas = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return teas.filter((tea) => {
            const matchesPublish =
                publishFilter === 'all' ||
                (publishFilter === 'published' && tea.isPublished) ||
                (publishFilter === 'draft' && !tea.isPublished);
            const ingredientText = tea.ingredients?.map((item) => item.name).join(' ').toLowerCase() || '';
            const matchesSearch =
                !keyword ||
                tea.name?.toLowerCase().includes(keyword) ||
                ingredientText.includes(keyword);

            return matchesPublish && matchesSearch;
        });
    }, [publishFilter, search, teas]);

    const publishedCount = teas.filter((tea) => tea.isPublished).length;
    const lowStockCount = teas.filter((tea) => Number(tea.stock || 0) <= 10).length;
    const aiCount = teas.filter((tea) => tea.source === 'ai' || tea.isAIMixture).length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Catalog"
                title="Quản lý sản phẩm trà"
                description="Cập nhật tên, ảnh, giá, tồn kho và trạng thái hiển thị của từng sản phẩm trong cửa hàng."
                meta={
                    <>
                        <StatusBadge tone="green">{publishedCount} đang bán</StatusBadge>
                        <StatusBadge tone={lowStockCount > 0 ? 'red' : 'slate'}>{lowStockCount} tồn thấp</StatusBadge>
                    </>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchTeas} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard label="Tổng sản phẩm" value={teas.length} caption="Bao gồm draft" tone="green" />
                <MetricCard label="Đang bán" value={publishedCount} caption="Hiển thị ngoài shop" tone="purple" />
                <MetricCard label="Công thức AI" value={aiCount} caption="Từ luồng duyệt AI" tone="blue" />
            </div>

            <AdminPanel
                title="Danh sách sản phẩm"
                description="Dữ liệu sửa trực tiếp trên từng dòng, nhấn Lưu để cập nhật API."
                actions={
                    <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-[220px_180px]">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm sản phẩm" className={adminInputClass} />
                        <select value={publishFilter} onChange={(e) => setPublishFilter(e.target.value)} className={adminSelectClass}>
                            <option value="all">Tất cả trạng thái</option>
                            <option value="published">Đang bán</option>
                            <option value="draft">Bản nháp</option>
                        </select>
                    </div>
                }
            >
                {loading ? (
                    <LoadingState rows={5} />
                ) : filteredTeas.length ? (
                    <div className="divide-y divide-slate-100">
                        {filteredTeas.map((tea) => (
                            <div key={tea._id} className="grid gap-4 py-5 first:pt-0 last:pb-0 2xl:grid-cols-[1fr_520px_92px] 2xl:items-end">
                                <div className="flex min-w-0 gap-4">
                                    <img src={tea.image} alt={tea.name} className="h-20 w-20 shrink-0 rounded-lg object-cover ring-1 ring-slate-200" />
                                    <div className="min-w-0 flex-1 space-y-3">
                                        <FormField label="Tên sản phẩm">
                                            <input value={tea.name || ''} onChange={(e) => updateTeaField(tea._id, { name: e.target.value })} className={adminInputClass} />
                                        </FormField>
                                        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                                            {tea.ingredients?.map((item) => item.name).join(', ') || 'Chưa gắn nguyên liệu'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                                    <FormField label="Giá">
                                        <input type="number" value={tea.price || 0} onChange={(e) => updateTeaField(tea._id, { price: Number(e.target.value) })} className={adminInputClass} />
                                    </FormField>
                                    <FormField label="Tồn">
                                        <input type="number" value={tea.stock || 0} onChange={(e) => updateTeaField(tea._id, { stock: Number(e.target.value) })} className={adminInputClass} />
                                    </FormField>
                                    <FormField label="Hiển thị">
                                        <select value={tea.isPublished ? 'published' : 'draft'} onChange={(e) => updateTeaField(tea._id, { isPublished: e.target.value === 'published' })} className={adminSelectClass}>
                                            <option value="published">Đang bán</option>
                                            <option value="draft">Bản nháp</option>
                                        </select>
                                    </FormField>
                                    <FormField label="Ảnh">
                                        <input value={tea.image || ''} onChange={(e) => updateTeaField(tea._id, { image: e.target.value })} className={adminInputClass} />
                                    </FormField>
                                </div>

                                <div className="flex flex-wrap gap-2 2xl:block">
                                    <StatusBadge tone={tea.stock <= 10 ? 'red' : 'green'}>{formatCurrency(tea.price)}</StatusBadge>
                                    <AdminButton className="mt-0 w-full 2xl:mt-3" onClick={() => updateTea(tea)} disabled={savingId === tea._id}>
                                        Lưu
                                    </AdminButton>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Không có sản phẩm phù hợp"
                        description="Thử đổi bộ lọc hoặc từ khóa tìm kiếm."
                        action={<AdminButton variant="neutral" onClick={() => { setSearch(''); setPublishFilter('all'); }}>Xóa bộ lọc</AdminButton>}
                    />
                )}
            </AdminPanel>
        </div>
    );
};

export default AdminTeasPage;
