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
    formatDateTime,
} from '../../components/admin/adminUtils';

const initialPost = { title: '', summary: '', content: '', coverImage: '', tags: '', status: 'draft' };

const statusTones = {
    draft: 'yellow',
    published: 'green',
};

const AdminPostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState(initialPost);
    const [editingId, setEditingId] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/admin/posts');
            setPosts(data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải bài viết.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const resetForm = () => {
        setForm(initialPost);
        setEditingId('');
    };

    const buildPayload = () => ({
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    });

    const submitPost = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');
            if (editingId) {
                await api.put(`/admin/posts/${editingId}`, buildPayload());
            } else {
                await api.post('/admin/posts', buildPayload());
            }

            resetForm();
            await fetchPosts();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể lưu bài viết.');
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (post) => {
        setEditingId(post._id);
        setForm({
            title: post.title || '',
            summary: post.summary || '',
            content: post.content || '',
            coverImage: post.coverImage || '',
            tags: (post.tags || []).join(', '),
            status: post.status || 'draft',
        });
    };

    const deletePost = async (post) => {
        if (!window.confirm(`Xóa bài viết "${post.title}"?`)) {
            return;
        }

        try {
            setError('');
            await api.delete(`/admin/posts/${post._id}`);
            if (editingId === post._id) {
                resetForm();
            }
            await fetchPosts();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xóa bài viết.');
        }
    };

    const filteredPosts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return posts.filter((post) => {
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
            const matchesSearch =
                !keyword ||
                post.title?.toLowerCase().includes(keyword) ||
                post.summary?.toLowerCase().includes(keyword) ||
                post.slug?.toLowerCase().includes(keyword);

            return matchesStatus && matchesSearch;
        });
    }, [posts, search, statusFilter]);

    const publishedCount = posts.filter((post) => post.status === 'published').length;
    const draftCount = posts.filter((post) => post.status === 'draft').length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Content"
                title="Quản lý bài viết"
                description="Tạo mới, chỉnh sửa, xuất bản hoặc xóa bài viết cộng đồng từ cùng một luồng làm việc."
                meta={
                    <>
                        <StatusBadge tone="green">{publishedCount} published</StatusBadge>
                        <StatusBadge tone="yellow">{draftCount} draft</StatusBadge>
                    </>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchPosts} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard label="Tổng bài viết" value={posts.length} caption="Tất cả trạng thái" tone="green" />
                <MetricCard label="Đã xuất bản" value={publishedCount} caption="Hiển thị ngoài blog" tone="purple" />
                <MetricCard label="Bản nháp" value={draftCount} caption="Cần hoàn thiện" tone="yellow" />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <AdminPanel
                    title={editingId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                    description={editingId ? 'Đang sửa bài đã chọn. Lưu để cập nhật nội dung.' : 'Soạn nội dung markdown, gắn tags và chọn trạng thái xuất bản.'}
                    actions={editingId && <AdminButton variant="neutral" onClick={resetForm}>Hủy sửa</AdminButton>}
                >
                    <form onSubmit={submitPost} className="space-y-4">
                        <FormField label="Tiêu đề">
                            <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required placeholder="Tiêu đề bài viết" className={adminInputClass} />
                        </FormField>
                        <FormField label="Tóm tắt">
                            <input value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} required placeholder="Mô tả ngắn" className={adminInputClass} />
                        </FormField>
                        <FormField label="Ảnh cover">
                            <input value={form.coverImage} onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))} placeholder="https://..." className={adminInputClass} />
                        </FormField>
                        <FormField label="Tags" hint="Phân tách bằng dấu phẩy. Ví dụ: trà ngủ ngon, thảo mộc">
                            <input value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="tag1, tag2" className={adminInputClass} />
                        </FormField>
                        <FormField label="Nội dung markdown">
                            <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows="9" required placeholder="Nội dung bài viết" className={adminTextareaClass} />
                        </FormField>
                        <FormField label="Trạng thái">
                            <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className={adminSelectClass}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </FormField>
                        <AdminButton type="submit" className="w-full" disabled={saving}>
                            {editingId ? 'Lưu cập nhật' : 'Lưu bài viết'}
                        </AdminButton>
                    </form>
                </AdminPanel>

                <AdminPanel
                    title="Danh sách bài viết"
                    description="Chọn một bài để sửa nhanh hoặc xóa khỏi hệ thống."
                    actions={
                        <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-[220px_160px]">
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm bài viết" className={adminInputClass} />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={adminSelectClass}>
                                <option value="all">Tất cả</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    }
                >
                    {loading ? (
                        <LoadingState rows={5} />
                    ) : filteredPosts.length ? (
                        <div className="divide-y divide-slate-100">
                            {filteredPosts.map((post) => (
                                <div key={post._id} className="grid gap-4 py-4 first:pt-0 last:pb-0 lg:grid-cols-[1fr_190px] lg:items-center">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-black text-slate-950">{post.title}</p>
                                            <StatusBadge tone={statusTones[post.status] || 'slate'}>{post.status}</StatusBadge>
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{post.summary}</p>
                                        <p className="mt-2 break-all text-xs font-bold text-slate-500">{post.slug} · {formatDateTime(post.updatedAt || post.createdAt)}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 lg:justify-end">
                                        <AdminButton variant={editingId === post._id ? 'secondary' : 'neutral'} onClick={() => startEdit(post)}>
                                            Sửa
                                        </AdminButton>
                                        <AdminButton variant="danger" onClick={() => deletePost(post)}>
                                            Xóa
                                        </AdminButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="Không có bài viết phù hợp"
                            description="Thử đổi bộ lọc hoặc tạo bài viết mới."
                            action={<AdminButton variant="neutral" onClick={() => { setSearch(''); setStatusFilter('all'); }}>Xóa bộ lọc</AdminButton>}
                        />
                    )}
                </AdminPanel>
            </div>
        </div>
    );
};

export default AdminPostsPage;
