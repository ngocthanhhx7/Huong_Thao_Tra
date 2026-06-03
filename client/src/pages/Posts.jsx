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
        <div className="max-w-6xl mx-auto px-4 py-24">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900">Báº£ng tin Trà Hoa Việt</h1>
                <p className="text-gray-500 mt-3">Cáº­p nháº­t bÃ i viáº¿t, hÆ°á»›ng dáº«n sá»­ dá»¥ng vÃ  cÃ¢u chuyá»‡n tháº£o má»™c má»›i nháº¥t.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                    <Link key={post._id} to={`/posts/${post.slug}`} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                        {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-56 object-cover" />}
                        <div className="p-6">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-2">{(post.tags || []).join(' â€¢ ')}</p>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{post.title}</h2>
                            <p className="text-gray-500 mb-5">{post.summary}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                <span className="px-3 py-2 rounded-full bg-gray-50 border border-gray-100">ðŸ‘ {(post.reactionSummary?.like || 0) + (post.reactionSummary?.love || 0) + (post.reactionSummary?.care || 0) + (post.reactionSummary?.wow || 0)}</span>
                                <span className="px-3 py-2 rounded-full bg-gray-50 border border-gray-100">ðŸ’¬ {post.commentCount || 0}</span>
                                <span className="px-3 py-2 rounded-full bg-gray-50 border border-gray-100">ðŸ”— {post.shareCount || 0}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Posts;

