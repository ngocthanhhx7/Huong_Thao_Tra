import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { StatusBadge } from '../../components/admin/AdminUi';

export default function AdminSuspiciousUsers() {
  const { user } = useContext(AuthContext);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewing, setReviewing] = useState(null);

  const fetchFlags = () => {
    api.get('/wellness/admin/suspicious')
      .then((res) => setFlags(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFlags(); }, []);

  const handleReview = async (flagId, action) => {
    try {
      await api.patch(`/wellness/admin/suspicious/${flagId}`, { action });
      fetchFlags();
      setReviewing(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const severityLabel = (s) => ({ low: 'Thấp', medium: 'Trung bình', high: 'Cao' }[s] || s);
  const severityTone = (s) => ({ low: 'green', medium: 'amber', high: 'red' }[s] || 'zinc');
  const statusLabel = (s) => ({ flagged: 'Chưa xem', reviewed: 'Đã xem', dismissed: 'Bỏ qua' }[s] || s);
  const ruleLabel = (r) => ({ multi_device: 'Nhiều IP', fake_data: 'Data ảo', bot_activity: 'Hành vi bot', ai_abuse: 'Lạm dụng AI', spam_content: 'Spam' }[r] || r);

  if (loading) {
    return <div className="admin-panel p-6"><p className="text-sm text-slate-500">Đang tải...</p></div>;
  }
  if (error) {
    return <div className="admin-panel p-6"><p className="text-sm text-red-600">Lỗi: {error}</p></div>;
  }

  return (
    <div className="admin-panel p-6 space-y-6">
      <div>
        <p className="admin-eyebrow">Quản lý cảnh báo</p>
        <h2 className="text-xl font-black text-slate-950">Tài khoản đáng ngờ</h2>
      </div>

      {flags.length === 0 ? (
        <p className="text-sm text-slate-400">Chưa có tài khoản bị flag.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase text-slate-500">
                <th className="pb-2 pr-4">Người dùng</th>
                <th className="pb-2 pr-4">Quy tắc</th>
                <th className="pb-2 pr-4">Mức độ</th>
                <th className="pb-2 pr-4">Trạng thái</th>
                <th className="pb-2 pr-4">Ngày</th>
                <th className="pb-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((flag) => (
                <tr key={flag._id} className="border-b border-slate-100">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-slate-800">{flag.user?.name}</p>
                    <p className="text-slate-500">{flag.user?.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-slate-700">{ruleLabel(flag.rule)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge tone={severityTone(flag.severity)}>{severityLabel(flag.severity)}</StatusBadge>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge tone={flag.status === 'flagged' ? 'amber' : flag.status === 'dismissed' ? 'zinc' : 'green'}>
                      {statusLabel(flag.status)}
                    </StatusBadge>
                  </td>
                  <td className="py-3 pr-4 text-slate-500">
                    {new Date(flag.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {flag.status !== 'dismissed' && (
                        <>
                          <button
                            onClick={() => handleReview(flag._id, 'dismiss')}
                            className="px-3 py-1 text-xs font-bold rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            Bỏ qua
                          </button>
                          <button
                            onClick={() => handleReview(flag._id, 'pro_disabled')}
                            className="px-3 py-1 text-xs font-bold rounded bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            Tắt Pro
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
