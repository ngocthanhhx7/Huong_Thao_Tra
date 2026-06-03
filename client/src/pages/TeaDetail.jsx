import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const emptyReviewForm = { rating: 5, comment: '' };
const emptyFeedbackForm = { subject: '', message: '' };

const TeaDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [tea, setTea] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [reviewForm, setReviewForm] = useState(emptyReviewForm);
    const [replyDrafts, setReplyDrafts] = useState({});
    const [feedbackForm, setFeedbackForm] = useState(emptyFeedbackForm);
    const [hasPurchased, setHasPurchased] = useState(false);

    const ratingSummary = useMemo(() => {
        const summary = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((review) => {
            const score = Number(review.rating || 0);
            if (summary[score] !== undefined) {
                summary[score] += 1;
            }
        });
        return summary;
    }, [reviews]);

    const fetchTeaDetail = useCallback(async () => {
        const [teaRes, reviewsRes] = await Promise.all([
            api.get(`/teas/${id}`),
            api.get(`/reviews/tea/${id}`),
        ]);

        setTea(teaRes.data);
        setReviews(reviewsRes.data || []);
    }, [id]);

    useEffect(() => {
        const load = async () => {
            try {
                await fetchTeaDetail();
            } catch (fetchError) {
                setError(fetchError.response?.data?.message || 'Không thể tải chi tiết trà lúc này.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [fetchTeaDetail]);

    useEffect(() => {
        const checkPurchase = async () => {
            if (user) {
                try {
                    const { data } = await api.get(`/reviews/check-purchase/${id}`);
                    setHasPurchased(data.hasPurchased);
                } catch (err) {
                    console.error('Error checking purchase status:', err);
                }
            } else {
                setHasPurchased(false);
            }
        };
        checkPurchase();
    }, [id, user]);

    const addToCart = async () => {
        try {
            await api.post('/cart', { teaId: id, qty: 1 });
            setMessage('Đã thêm sản phẩm vào giỏ hàng.');
            setError('');
        } catch (cartError) {
            setError(cartError.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng.');
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reviews', {
                teaId: id,
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            });
            setReviewForm(emptyReviewForm);
            setMessage('Đánh giá của bạn đã được ghi nhận.');
            setError('');
            await fetchTeaDetail();
        } catch (reviewError) {
            setError(reviewError.response?.data?.message || 'Không thể gửi đánh giá.');
        }
    };

    const submitReply = async (reviewId) => {
        try {
            await api.post(`/reviews/${reviewId}/replies`, {
                comment: replyDrafts[reviewId] || '',
            });
            setReplyDrafts((prev) => ({ ...prev, [reviewId]: '' }));
            setMessage('Đã gửi phản hồi cho đánh giá.');
            setError('');
            await fetchTeaDetail();
        } catch (replyError) {
            setError(replyError.response?.data?.message || 'Không thể gửi phản hồi.');
        }
    };

    const submitProductFeedback = async (e) => {
        e.preventDefault();
        try {
            await api.post('/feedback', {
                category: 'product',
                subject: feedbackForm.subject,
                message: feedbackForm.message,
                tea: id,
            });
            setFeedbackForm(emptyFeedbackForm);
            setMessage('Feedback về sản phẩm đã được gửi tới admin/staff.');
            setError('');
        } catch (feedbackError) {
            setError(feedbackError.response?.data?.message || 'Không thể gửi feedback sản phẩm.');
        }
    };

    if (loading) {
        return <div className="text-center py-24 text-gray-500">Đang tải chi tiết sản phẩm...</div>;
    }

    if (!tea) {
        return <div className="text-center py-24 text-gray-500">Không tìm thấy sản phẩm.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 space-y-10">
            {(message || error) && (
                <div className={`rounded-2xl px-5 py-4 border ${error ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-700'}`}>
                    {error || message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10">
                <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                    <img src={tea.image} alt={tea.name} className="w-full h-[420px] object-cover" />
                </div>

                <div className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-6">
                    <div className="flex flex-wrap gap-3 items-center">
                        {tea.isAIMixture && <span className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold">Công thức AI đã duyệt</span>}
                        <span className="px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
                            {Number(tea.rating || 0).toFixed(1)}★ · {tea.numReviews || 0} đánh giá
                        </span>
                    </div>

                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">{tea.name}</h1>
                        <p className="text-gray-500 mt-4 leading-7">{tea.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-3xl bg-gray-50 border border-gray-100 p-5">
                            <p className="text-sm text-gray-500 mb-2">Giá bán</p>
                            <p className="text-3xl font-extrabold text-primary-600">{Number(tea.price).toLocaleString('vi-VN')}đ</p>
                        </div>
                        <div className="rounded-3xl bg-gray-50 border border-gray-100 p-5">
                            <p className="text-sm text-gray-500 mb-2">Tồn kho</p>
                            <p className="text-3xl font-extrabold text-gray-900">{tea.stock}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">Caffeine: {tea.caffeineLevel}</span>
                        {tea.mixGoal && <span className="px-4 py-2 rounded-full bg-sky-50 text-sky-700 text-sm font-semibold">Mục tiêu: {tea.mixGoal}</span>}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Công dụng nổi bật</p>
                        <div className="flex flex-wrap gap-2">
                            {(tea.benefits || []).map((benefit) => (
                                <span key={benefit} className="px-3 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                                    {benefit}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Thành phần</p>
                        <div className="flex flex-wrap gap-2">
                            {(tea.ingredients || []).map((ingredient) => (
                                <span key={ingredient._id || ingredient.name} className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                                    {ingredient.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button onClick={addToCart} className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-2xl font-bold">
                            Thêm vào giỏ hàng
                        </button>
                        <Link to="/cart" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-2xl font-bold">
                            Xem giỏ hàng
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8">
                <div className="space-y-8">
                    <div className="bg-white border border-gray-100 rounded-[32px] p-8">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900">Đánh giá khách hàng</h2>
                                <p className="text-gray-500 mt-2">Chỉ khách đã mua sản phẩm mới có thể đánh giá và phản hồi.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-extrabold text-amber-500">{Number(tea.rating || 0).toFixed(1)}</p>
                                <p className="text-sm text-gray-400">{tea.numReviews || 0} lượt đánh giá</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
                            {[5, 4, 3, 2, 1].map((score) => (
                                <div key={score} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
                                    <p className="font-bold text-gray-900">{score}★</p>
                                    <p className="text-sm text-gray-500 mt-1">{ratingSummary[score]} đánh giá</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            {reviews.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
                                    Chưa có đánh giá nào cho sản phẩm này.
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id} className="rounded-3xl border border-gray-100 p-5">
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{review.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-bold">
                                                {review.rating}★
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-4 leading-7">{review.comment}</p>

                                        <div className="mt-5 space-y-3">
                                            {(review.replies || []).map((reply) => (
                                                <div key={reply._id} className="ml-4 rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                                    <div className="flex justify-between gap-3">
                                                        <p className="font-semibold text-gray-900">{reply.name}</p>
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 mt-2">{reply.comment}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {user && hasPurchased ? (
                                            <div className="mt-5 flex gap-3">
                                                <input
                                                    value={replyDrafts[review._id] || ''}
                                                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [review._id]: e.target.value }))}
                                                    placeholder="Phản hồi đánh giá này..."
                                                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200"
                                                />
                                                <button onClick={() => submitReply(review._id)} className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold">
                                                    Trả lời
                                                </button>
                                            </div>
                                        ) : user ? (
                                            <p className="text-xs text-gray-400 mt-4">
                                                Bạn cần mua sản phẩm này trước khi phản hồi.
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-4">
                                                <Link to="/login" className="text-primary-600 font-bold">Đăng nhập</Link> để trả lời đánh giá này.
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {user && hasPurchased ? (
                        <form onSubmit={submitReview} className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-4">
                            <h2 className="text-2xl font-extrabold text-gray-900">Viết đánh giá</h2>
                            <select value={reviewForm.rating} onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200">
                                {[5, 4, 3, 2, 1].map((score) => (
                                    <option key={score} value={score}>{score} sao</option>
                                ))}
                            </select>
                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                                rows="5"
                                placeholder="Chia sẻ cảm nhận thật của bạn về sản phẩm..."
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                            />
                            <button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-2xl font-bold">
                                Gửi đánh giá
                            </button>
                        </form>
                    ) : (
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 text-center space-y-3">
                            <h2 className="text-2xl font-extrabold text-gray-900">Viết đánh giá</h2>
                            <p className="text-gray-500 text-sm">
                                {user 
                                    ? "Bạn chưa mua sản phẩm này. Chỉ khách đã mua sản phẩm mới có thể đánh giá." 
                                    : "Vui lòng đăng nhập và mua sản phẩm để viết đánh giá."
                                }
                            </p>
                            {!user && (
                                <Link to="/login" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
                                    Đăng nhập
                                </Link>
                            )}
                        </div>
                    )}

                    <form onSubmit={submitProductFeedback} className="bg-white border border-gray-100 rounded-[32px] p-8 space-y-4">
                        <h2 className="text-2xl font-extrabold text-gray-900">Gửi feedback về sản phẩm</h2>
                        <p className="text-sm text-gray-500">Feedback này gửi riêng cho admin/staff, không hiển thị public như phần đánh giá.</p>
                        <input
                            value={feedbackForm.subject}
                            onChange={(e) => setFeedbackForm((prev) => ({ ...prev, subject: e.target.value }))}
                            placeholder="Chủ đề feedback"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                        />
                        <textarea
                            value={feedbackForm.message}
                            onChange={(e) => setFeedbackForm((prev) => ({ ...prev, message: e.target.value }))}
                            rows="5"
                            placeholder="Ví dụ: bao bì, hương vị, trải nghiệm sử dụng, góp ý cải thiện..."
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                        />
                        <button className="w-full bg-white text-gray-800 border border-gray-200 py-4 rounded-2xl font-bold">
                            Gửi feedback sản phẩm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeaDetail;
