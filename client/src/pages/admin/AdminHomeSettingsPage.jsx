import { useEffect, useState } from 'react';
import api from '../../services/api';
import {
    AdminButton,
    AdminPageHeader,
    AdminPanel,
    ErrorState,
    FormField,
    LoadingState,
    StatusBadge,
} from '../../components/admin/AdminUi';
import { adminSelectClass } from '../../components/admin/adminUtils';

const AdminHomeSettingsPage = () => {
    const [teas, setTeas] = useState([]);
    const [featuredTea, setFeaturedTea] = useState('');
    const [showcaseTeas, setShowcaseTeas] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccessMsg('');

            // Fetch all teas
            const teasRes = await api.get('/teas');
            const allTeas = teasRes.data || [];
            setTeas(allTeas);

            // Fetch homepage settings
            const settingsRes = await api.get('/teas/home-settings');
            const settings = settingsRes.data;

            if (settings) {
                if (settings.featuredTea) {
                    setFeaturedTea(settings.featuredTea._id || settings.featuredTea);
                } else if (allTeas.length > 0) {
                    setFeaturedTea(allTeas[0]._id);
                }

                if (settings.showcaseTeas && settings.showcaseTeas.length > 0) {
                    const mappedShowcase = ['', '', '', ''].map((_, idx) => {
                        const teaObj = settings.showcaseTeas[idx];
                        return teaObj ? (teaObj._id || teaObj) : '';
                    });
                    setShowcaseTeas(mappedShowcase);
                } else {
                    const defaultShowcase = allTeas.slice(0, 4).map((t) => t._id);
                    while (defaultShowcase.length < 4) {
                        defaultShowcase.push('');
                    }
                    setShowcaseTeas(defaultShowcase);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải dữ liệu cấu hình.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShowcaseChange = (index, value) => {
        setShowcaseTeas((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError('');
            setSuccessMsg('');

            if (!featuredTea) {
                setError('Vui lòng chọn sản phẩm nổi bật chính.');
                setSaving(false);
                return;
            }

            // Filter out empty entries to keep only valid MongoDB IDs
            const filteredShowcase = showcaseTeas.filter(id => id !== '');

            await api.put('/admin/home-settings', {
                featuredTea,
                showcaseTeas: filteredShowcase,
            });

            setSuccessMsg('Cấu hình trang chủ đã được cập nhật thành công!');
            // Re-fetch to ensure frontend state is populated and accurate
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lưu cấu hình trang chủ.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <AdminPageHeader
                    eyebrow="Cấu hình"
                    title="Cài đặt Trang chủ"
                    description="Đang tải dữ liệu cấu hình..."
                />
                <LoadingState rows={4} />
            </div>
        );
    }

    const featuredTeaObj = teas.find((t) => t._id === featuredTea);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Cấu hình"
                title="Cài đặt Trang chủ"
                description="Lựa chọn sản phẩm trưng bày ở vị trí nổi bật và danh mục tư vấn AI trên trang chủ."
                meta={
                    successMsg ? (
                        <StatusBadge tone="teal">{successMsg}</StatusBadge>
                    ) : (
                        <StatusBadge tone="slate">Chưa lưu thay đổi</StatusBadge>
                    )
                }
            />

            {error && <ErrorState message={error} onRetry={fetchData} />}

            <form onSubmit={handleSave}>
                <div className="grid gap-6">
                    {/* Featured Product Section */}
                    <AdminPanel
                        title="Sản phẩm nổi bật chính (Featured Product)"
                        description="Sản phẩm hiển thị chi tiết kèm theo mô tả hương vị, cơ chế tác động của AI và các nguyên liệu bay xung quanh ấm trà."
                    >
                        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] items-start">
                            <FormField label="Chọn sản phẩm nổi bật" hint="Nên chọn sản phẩm có hình ảnh đẹp và mô tả chi tiết đầy đủ.">
                                <select
                                    value={featuredTea}
                                    onChange={(e) => setFeaturedTea(e.target.value)}
                                    className={adminSelectClass}
                                >
                                    <option value="">-- Chọn một trà --</option>
                                    {teas.map((tea) => (
                                        <option key={tea._id} value={tea._id}>
                                            {tea.name} ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tea.price)})
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            {featuredTeaObj && (
                                <div className="rounded-xl border border-slate-200 bg-white p-4 flex gap-4 items-center">
                                    <img
                                        src={featuredTeaObj.image}
                                        alt={featuredTeaObj.name}
                                        className="h-16 w-16 rounded-lg object-cover border border-slate-100"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-black text-slate-900 truncate">{featuredTeaObj.name}</h4>
                                        <p className="text-xs text-slate-500 truncate mt-1">
                                            {featuredTeaObj.caffeineLevel ? `Caffeine: ${featuredTeaObj.caffeineLevel}` : 'Không chỉ định caffeine'}
                                        </p>
                                        <div className="mt-2 flex gap-1.5 flex-wrap">
                                            {featuredTeaObj.benefits?.slice(0, 2).map((b) => (
                                                <span key={b} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100/30">
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AdminPanel>

                    {/* Showcase Slots Section */}
                    <AdminPanel
                        title="Bộ sưu tập trưng bày (Showcase Products)"
                        description="4 sản phẩm đại diện cho 4 trạng thái sức khỏe mà AI khuyên dùng (Ngủ ngon, Căng thẳng, Thanh lọc, Năng lượng)."
                    >
                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* Slot 1 */}
                            <FormField label="Slot 1 - Trạng thái: Ngủ ngon" hint="Sản phẩm gợi ý khi chọn cải thiện giấc ngủ.">
                                <select
                                    value={showcaseTeas[0] || ''}
                                    onChange={(e) => handleShowcaseChange(0, e.target.value)}
                                    className={adminSelectClass}
                                >
                                    <option value="">-- Chọn sản phẩm --</option>
                                    {teas.map((tea) => (
                                        <option key={tea._id} value={tea._id}>
                                            {tea.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            {/* Slot 2 */}
                            <FormField label="Slot 2 - Trạng thái: Giảm căng thẳng" hint="Sản phẩm gợi ý khi chọn giảm mệt mỏi, stress.">
                                <select
                                    value={showcaseTeas[1] || ''}
                                    onChange={(e) => handleShowcaseChange(1, e.target.value)}
                                    className={adminSelectClass}
                                >
                                    <option value="">-- Chọn sản phẩm --</option>
                                    {teas.map((tea) => (
                                        <option key={tea._id} value={tea._id}>
                                            {tea.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            {/* Slot 3 */}
                            <FormField label="Slot 3 - Trạng thái: Thanh lọc" hint="Sản phẩm gợi ý khi chọn giải độc và nhẹ bụng.">
                                <select
                                    value={showcaseTeas[2] || ''}
                                    onChange={(e) => handleShowcaseChange(2, e.target.value)}
                                    className={adminSelectClass}
                                >
                                    <option value="">-- Chọn sản phẩm --</option>
                                    {teas.map((tea) => (
                                        <option key={tea._id} value={tea._id}>
                                            {tea.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            {/* Slot 4 */}
                            <FormField label="Slot 4 - Trạng thái: Năng lượng" hint="Sản phẩm gợi ý khi chọn cải thiện sự tỉnh táo.">
                                <select
                                    value={showcaseTeas[3] || ''}
                                    onChange={(e) => handleShowcaseChange(3, e.target.value)}
                                    className={adminSelectClass}
                                >
                                    <option value="">-- Chọn sản phẩm --</option>
                                    {teas.map((tea) => (
                                        <option key={tea._id} value={tea._id}>
                                            {tea.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </div>
                    </AdminPanel>

                    {/* Actions Panel */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <AdminButton variant="neutral" onClick={fetchData} disabled={saving}>
                            Hủy thay đổi
                        </AdminButton>
                        <AdminButton variant="primary" type="submit" disabled={saving}>
                            {saving ? 'Đang lưu cấu hình...' : 'Lưu cài đặt'}
                        </AdminButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminHomeSettingsPage;
