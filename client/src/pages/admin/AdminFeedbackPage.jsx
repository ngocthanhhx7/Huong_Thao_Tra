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
    adminSelectClass,
    adminTextareaClass,
    formatDateTime,
} from '../../components/admin/adminUtils';

const FEEDBACK_STATUSES = ['new', 'in_review', 'resolved', 'closed'];

const statusLabels = {
    new: 'Mới',
    in_review: 'Đang xử lý',
    resolved: 'Đã xử lý',
    closed: 'Đã đóng',
};

const statusTones = {
    new: 'yellow',
    in_review: 'purple',
    resolved: 'green',
    closed: 'slate',
};

const AdminFeedbackPage = () => {
    const [feedback, setFeedback] = useState([]);
    const [statusFilter, setStatusFilter] = useState('open');
    const [replyDrafts, setReplyDrafts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState('');

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/admin/feedback');
            setFeedback(data || []);
            setReplyDrafts(
                (data || []).reduce((acc, item) => {
                    acc[item._id] = item.adminReply || '';
                    return acc;
                }, {})
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải feedback.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const updateFeedback = async (id, status) => {
        try {
            setUpdatingId(id);
            await api.patch(`/admin/feedback/${id}`, {
                status,
                adminReply: replyDrafts[id] || `Cập nhật trạng thái sang ${statusLabels[status] || status}`,
            });
            await fetchFeedback();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật feedback.');
        } finally {
            setUpdatingId('');
        }
    };

    const filteredFeedback = useMemo(() => {
        if (statusFilter === 'all') {
            return feedback;
        }

        if (statusFilter === 'open') {
            return feedback.filter((item) => item.status === 'new' || item.status === 'in_review');
        }

        return feedback.filter((item) => item.status === statusFilter);
    }, [feedback, statusFilter]);

    const openCount = feedback.filter((item) => item.status === 'new' || item.status === 'in_review').length;
    const resolvedCount = feedback.filter((item) => item.status === 'resolved' || item.status === 'closed').length;
    const productCount = feedback.filter((item) => item.tea).length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Feedback"
                title="Feedback khách hàng"
                description="Đọc phản hồi, ghi câu trả lời nội bộ và cập nhật trạng thái để khách nhận thông báo."
                meta={
                    <>
                        <StatusBadge tone={openCount > 0 ? 'yellow' : 'green'}>{openCount} đang mở</StatusBadge>
                        <StatusBadge tone="green">{resolvedCount} đã xử lý</StatusBadge>
                    </>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchFeedback} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard label="Tổng feedback" value={feedback.length} caption="Tất cả danh mục" tone="green" />
                <MetricCard label="Đang mở" value={openCount} caption="new hoặc in_review" tone={openCount > 0 ? 'yellow' : 'slate'} />
                <MetricCard label="Gắn sản phẩm" value={productCount} caption="Có tea liên quan" tone="purple" />
            </div>

            <AdminPanel
                title="Hộp xử lý feedback"
                description="Ưu tiên các feedback đang mở, sau đó chuyển resolved hoặc closed khi hoàn tất."
                actions={
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${adminSelectClass} w-full sm:w-[190px]`}>
                        <option value="open">Đang mở</option>
                        <option value="all">Tất cả</option>
                        {FEEDBACK_STATUSES.map((status) => (
                            <option key={status} value={status}>{statusLabels[status]}</option>
                        ))}
                    </select>
                }
            >
                {loading ? (
                    <LoadingState rows={5} />
                ) : filteredFeedback.length ? (
                    <div className="divide-y divide-slate-100">
                        {filteredFeedback.map((item) => (
                            <div key={item._id} className="grid gap-5 py-5 first:pt-0 last:pb-0 xl:grid-cols-[1fr_360px]">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-black text-slate-950">{item.subject}</h3>
                                        <StatusBadge tone={statusTones[item.status] || 'slate'}>{statusLabels[item.status] || item.status}</StatusBadge>
                                        <StatusBadge tone="blue">{item.category}</StatusBadge>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {item.user?.name || 'Khách hàng'} · {formatDateTime(item.createdAt)}
                                    </p>
                                    {item.tea && <p className="mt-2 text-sm font-bold text-[#2F7D14]">Sản phẩm: {item.tea.name}</p>}
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{item.message}</p>
                                    {item.handledBy && (
                                        <p className="mt-3 text-xs font-bold text-slate-500">
                                            Xử lý bởi {item.handledBy.name} · {item.handledBy.role}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                                    <FormField label="Phản hồi admin">
                                        <textarea
                                            value={replyDrafts[item._id] || ''}
                                            onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [item._id]: e.target.value }))}
                                            placeholder="Nhập phản hồi hoặc ghi chú xử lý"
                                            className={adminTextareaClass}
                                        />
                                    </FormField>
                                    <div className="grid grid-cols-2 gap-2">
                                        {FEEDBACK_STATUSES.map((status) => (
                                            <AdminButton
                                                key={status}
                                                variant={status === 'closed' ? 'neutral' : status === 'resolved' ? 'primary' : 'secondary'}
                                                onClick={() => updateFeedback(item._id, status)}
                                                disabled={updatingId === item._id}
                                            >
                                                {statusLabels[status]}
                                            </AdminButton>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="Không có feedback phù hợp"
                        description="Hàng xử lý hiện trống hoặc bộ lọc không có dữ liệu."
                        action={<AdminButton variant="neutral" onClick={() => setStatusFilter('all')}>Xem tất cả</AdminButton>}
                    />
                )}
            </AdminPanel>
        </div>
    );
};

export default AdminFeedbackPage;
