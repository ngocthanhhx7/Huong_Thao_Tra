import { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const REACTIONS = [
    { key: 'like', label: 'Like', icon: '👍' },
    { key: 'love', label: 'Love', icon: '❤️' },
    { key: 'care', label: 'Care', icon: '🤗' },
    { key: 'wow', label: 'Wow', icon: '😮' },
];

const CommentItem = ({ comment, user, replyDrafts, setReplyDrafts, submitReply }) => (
    <div className="rounded-3xl border border-gray-100 bg-white p-5">
        <div className="flex justify-between gap-3">
            <div>
                <p className="font-bold text-gray-900">{comment.user?.name || 'Khách ghé thăm'}</p>
                <p className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <span className="text-xs font-bold uppercase text-primary-600">{comment.replyCount || 0} phản hồi</span>
        </div>
        <p className="text-gray-600 mt-4 leading-7">{comment.content}</p>

        <div className="space-y-3 mt-5">
            {(comment.replies || []).map((reply) => (
                <div key={reply._id} className="ml-4 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                    <div className="flex justify-between gap-3">
                        <p className="font-semibold text-gray-900">{reply.user?.name || 'Người dùng'}</p>
                        <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{reply.content}</p>
                </div>
            ))}
        </div>

        {user ? (
            <div className="mt-5 flex gap-3">
                <input
                    value={replyDrafts[comment._id] || ''}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [comment._id]: e.target.value }))}
                    placeholder="Trả lời bình luận này..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200"
                />
                <button onClick={() => submitReply(comment._id)} className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold">
                    Trả lời
                </button>
            </div>
        ) : (
            <p className="text-sm text-gray-500 mt-4">
                <Link to="/login" className="text-primary-600 font-bold">Đăng nhập</Link> để bình luận và phản hồi.
            </p>
        )}
    </div>
);

CommentItem.propTypes = {
    comment: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        replyCount: PropTypes.number,
        user: PropTypes.shape({
            name: PropTypes.string,
        }),
        replies: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                content: PropTypes.string.isRequired,
                createdAt: PropTypes.string.isRequired,
                user: PropTypes.shape({
                    name: PropTypes.string,
                }),
            })
        ),
    }).isRequired,
    user: PropTypes.object,
    replyDrafts: PropTypes.object.isRequired,
    setReplyDrafts: PropTypes.func.isRequired,
    submitReply: PropTypes.func.isRequired,
};

const PostDetail = () => {
    const { slug } = useParams();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [message, setMessage] = useState('');
    const [commentDraft, setCommentDraft] = useState('');
    const [replyDrafts, setReplyDrafts] = useState({});

    const fetchPost = useCallback(async () => {
        const { data } = await api.get(`/posts/${slug}`);
        setPost(data);
    }, [slug]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const reactToPost = async (reaction) => {
        try {
            const { data } = await api.post(`/posts/${slug}/reactions`, { reaction });
            setPost((prev) => ({ ...prev, ...data }));
        } catch (error) {
            setMessage(error.response?.data?.message || 'Không thể thả cảm xúc lúc này.');
        }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/posts/${slug}/comments`, { content: commentDraft });
            setCommentDraft('');
            setMessage('Đã thêm bình luận cho bài viết.');
            await fetchPost();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Không thể gửi bình luận.');
        }
    };

    const submitReply = async (commentId) => {
        try {
            await api.post(`/posts/comments/${commentId}/replies`, {
                content: replyDrafts[commentId] || '',
            });
            setReplyDrafts((prev) => ({ ...prev, [commentId]: '' }));
            setMessage('Đã gửi phản hồi.');
            await fetchPost();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Không thể gửi phản hồi.');
        }
    };

    const sharePost = async () => {
        if (!post) {
            return;
        }

        const url = `${window.location.origin}/posts/${slug}`;
        let channel = 'copy';

        try {
            if (navigator.share) {
                await navigator.share({ title: post.title, text: post.summary, url });
                channel = 'webshare';
            } else {
                await navigator.clipboard.writeText(url);
            }

            const { data } = await api.post(`/posts/${slug}/share`, { channel });
            setPost((prev) => ({ ...prev, ...data }));
            setMessage(channel === 'webshare' ? 'Đã chia sẻ bài viết thành công.' : 'Đã sao chép link bài viết.');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Không thể chia sẻ bài viết lúc này.');
        }
    };

    if (!post) return <div className="text-center py-24 text-gray-500">Đang tải bài viết...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-24 space-y-8">
            {message && <div className="rounded-2xl border border-primary-100 bg-primary-50 text-primary-700 px-5 py-4">{message}</div>}

            <article className="bg-white rounded-[32px] border border-gray-100 overflow-hidden">
                {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-80 object-cover" />}
                <div className="p-8 md:p-10">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3">{(post.tags || []).join(' • ')}</p>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                    <p className="text-gray-500 mb-6">{post.summary}</p>
                    <div className="flex flex-wrap gap-3 mb-8">
                        {REACTIONS.map((reaction) => (
                            <button
                                key={reaction.key}
                                onClick={() => reactToPost(reaction.key)}
                                className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                                    post.myReaction === reaction.key
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-700 border-gray-200'
                                }`}
                            >
                                {reaction.icon} {reaction.label} ({post.reactionSummary?.[reaction.key] || 0})
                            </button>
                        ))}
                        <button onClick={sharePost} className="px-4 py-2 rounded-full border border-primary-100 bg-primary-50 text-primary-700 text-sm font-semibold">
                            🔗 Chia sẻ ({post.shareCount || 0})
                        </button>
                        <span className="px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-sm font-semibold border border-gray-100">
                            💬 {post.commentCount || 0} bình luận
                        </span>
                    </div>
                    <div className="prose max-w-none">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </div>
            </article>

            <section className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-8">
                <form onSubmit={submitComment} className="bg-white rounded-[32px] border border-gray-100 p-8 space-y-4 h-fit">
                    <h2 className="text-2xl font-extrabold text-gray-900">Bình luận bài viết</h2>
                    {!user && <p className="text-sm text-gray-500">Bạn cần đăng nhập để bình luận, phản hồi và chia sẻ bài viết.</p>}
                    <textarea
                        value={commentDraft}
                        onChange={(e) => setCommentDraft(e.target.value)}
                        rows="6"
                        placeholder="Chia sẻ cảm nhận hoặc câu hỏi của bạn về bài viết này..."
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                    />
                    <button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-2xl font-bold">
                        Gửi bình luận
                    </button>
                </form>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-extrabold text-gray-900">Thảo luận</h2>
                        <span className="text-sm text-gray-500">{post.commentCount || 0} chủ đề</span>
                    </div>
                    {(post.comments || []).length === 0 ? (
                        <div className="rounded-[32px] border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
                            Chưa có bình luận nào cho bài viết này.
                        </div>
                    ) : (
                        (post.comments || []).map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                user={user}
                                replyDrafts={replyDrafts}
                                setReplyDrafts={setReplyDrafts}
                                submitReply={submitReply}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default PostDetail;
