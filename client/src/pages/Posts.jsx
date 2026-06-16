import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await api.get('/posts');
            setPosts(data || []);
        };

        fetchPosts();
    }, []);

    return (
        <div className="luxury-page">
            <div className="luxury-container max-w-6xl mx-auto px-4 py-24">
                <div className="mb-12 text-center animate-soft-rise">
                    <span className="luxury-kicker">📖 Góc sống khỏe</span>
                    <h1 className="font-display-h1 text-5xl md:text-7xl text-[#27451f] mt-5">Bảng tin Trà Hoa Việt</h1>
                    <p className="text-gray-600 mt-4 leading-8">Cập nhật bài viết, hướng dẫn sử dụng và câu chuyện thảo mộc mới nhất.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <Link key={post._id} to={`/posts/${post.slug}`} className="luxury-card luxury-card-hover overflow-hidden animate-soft-rise-delay group">
                            {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />}
                            <div className="p-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">{(post.tags || []).join(' • ')}</p>
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{post.title}</h2>
                                <p className="text-gray-500 mb-5 leading-7">{post.summary}</p>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                    <span className="px-3 py-2 rounded-full bg-gray-50 border border-gray-100">👍 {(post.reactionSummary?.like || 0) + (post.reactionSummary?.love || 0) + (post.reactionSummary?.care || 0) + (post.reactionSummary?.wow || 0)}</span>
                                    <span className="px-3 py-2 rounded-full bg-gray-50 border border-gray-100">💬 {post.commentCount || 0}</span>
                                    <span className="px-3 py-2 rounded-full bg-gray-50 border border-gray-100">🔗 {post.shareCount || 0}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Posts;
