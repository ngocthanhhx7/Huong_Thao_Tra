import { useEffect, useState } from 'react';
import api from '../../services/api';

const initialPost = { title: '', summary: '', content: '', coverImage: '', tags: '', status: 'draft' };

const AdminPostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState(initialPost);

    const fetchPosts = async () => {
        const { data } = await api.get('/admin/posts');
        setPosts(data || []);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const submitPost = async (e) => {
        e.preventDefault();
        await api.post('/admin/posts', {
            ...form,
            tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        });
        setForm(initialPost);
        fetchPosts();
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-8">
            <form onSubmit={submitPost} className="bg-white rounded-[32px] border border-gray-100 p-8 space-y-4">
                <h2 className="text-3xl font-extrabold text-gray-900">Quản lý bài viết</h2>
                <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required placeholder="Tiêu đề" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <input value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} required placeholder="Tóm tắt" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <input value={form.coverImage} onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))} placeholder="Ảnh cover" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <input value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="tag1, tag2" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows="8" required placeholder="Nội dung markdown" className="w-full px-4 py-3 rounded-2xl border border-gray-200" />
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
                <button className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold">Lưu bài viết</button>
            </form>

            <div className="bg-white rounded-[32px] border border-gray-100 p-8">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Danh sách bài viết</h3>
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post._id} className="rounded-3xl border border-gray-100 p-4">
                            <p className="font-bold text-gray-900">{post.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{post.status} • {post.slug}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPostsPage;
