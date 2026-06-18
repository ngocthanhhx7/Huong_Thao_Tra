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
import AdminImageUploadField from '../../components/admin/AdminImageUploadField';

const AdminTeasPage = () => {
    const [teas, setTeas] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [search, setSearch] = useState('');
    const [publishFilter, setPublishFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingId, setSavingId] = useState('');
    const [editingIngredientsTeaId, setEditingIngredientsTeaId] = useState('');
    const [ingSearchText, setIngSearchText] = useState('');

    const fetchTeas = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Fetch both teas and catalog ingredients in parallel
            const [teasRes, ingRes] = await Promise.all([
                api.get('/admin/teas'),
                api.get('/admin/ingredients'),
            ]);

            setTeas(teasRes.data || []);
            setAllIngredients(ingRes.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải dữ liệu quản trị.');
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
            const ingredientIds = (tea.ingredients || []).map((ing) =>
                typeof ing === 'object' ? ing._id : ing
            );
            await api.patch(`/admin/teas/${tea._id}`, {
                name: tea.name,
                image: tea.image,
                price: tea.price,
                stock: tea.stock,
                isPublished: tea.isPublished,
                ingredients: ingredientIds,
            });
            await fetchTeas();
            setEditingIngredientsTeaId('');
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
                description="Cập nhật tên, ảnh, giá, tồn kho, liên kết nguyên liệu và trạng thái hiển thị của từng sản phẩm trong cửa hàng."
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
                <MetricCard label="Đang bán" value={publishedCount} caption="Hiển thị ngoài shop" tone="teal" />
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
                                        
                                        {/* Linked Ingredients Multi-Select Selector */}
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nguyên liệu liên kết</span>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {tea.ingredients && tea.ingredients.length > 0 ? (
                                                    tea.ingredients.map((ing) => (
                                                        <StatusBadge key={ing._id} tone="slate">
                                                            {ing.name}
                                                        </StatusBadge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-500 italic">Chưa gắn nguyên liệu</span>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingIngredientsTeaId(editingIngredientsTeaId === tea._id ? '' : tea._id);
                                                    setIngSearchText('');
                                                }}
                                                className="text-xs text-primary-700 hover:text-primary-900 font-extrabold flex items-center gap-1 bg-primary-50 px-2.5 py-1 rounded-lg"
                                            >
                                                {editingIngredientsTeaId === tea._id ? '✕ Đóng bảng chọn' : '⚙ Liên kết nguyên liệu'}
                                            </button>

                                            {editingIngredientsTeaId === tea._id && (
                                                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 animate-soft-rise max-w-md shadow-sm">
                                                    <input
                                                        type="text"
                                                        placeholder="Tìm nhanh nguyên liệu..."
                                                        value={ingSearchText}
                                                        onChange={(e) => setIngSearchText(e.target.value)}
                                                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary-700"
                                                    />
                                                    <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
                                                        {allIngredients
                                                            .filter((ing) => ing.name?.toLowerCase().includes(ingSearchText.toLowerCase()))
                                                            .map((ing) => {
                                                                const isLinked = tea.ingredients?.some(
                                                                    (linked) => (typeof linked === 'object' ? linked._id : linked) === ing._id
                                                                );
                                                                return (
                                                                    <label
                                                                        key={ing._id}
                                                                        className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-100 px-1 rounded transition-colors"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!isLinked}
                                                                            onChange={() => {
                                                                                let updatedIngredients = [...(tea.ingredients || [])];
                                                                                if (isLinked) {
                                                                                    updatedIngredients = updatedIngredients.filter(
                                                                                        (linked) => (typeof linked === 'object' ? linked._id : linked) !== ing._id
                                                                                    );
                                                                                } else {
                                                                                    updatedIngredients.push(ing);
                                                                                }
                                                                                updateTeaField(tea._id, { ingredients: updatedIngredients });
                                                                            }}
                                                                            className="w-3.5 h-3.5 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                                                                        />
                                                                        <span className="font-bold text-slate-700">{ing.name}</span>
                                                                    </label>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
                                    <AdminImageUploadField
                                        label="Ảnh"
                                        hint="Dán URL hiện có hoặc chọn file để upload lên S3."
                                        value={tea.image || ''}
                                        folder="teas"
                                        onChange={(url) => updateTeaField(tea._id, { image: url })}
                                    />
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
