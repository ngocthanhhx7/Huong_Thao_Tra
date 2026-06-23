import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { StatusBadge } from '../../components/admin/AdminUi';

export default function AdminChallengesPage() {
  const { user } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'streak', target: 7, startDate: '', endDate: '' });

  const fetchChallenges = () => {
    api.get('/wellness/admin/challenges')
      .then((res) => setChallenges(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchChallenges(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/wellness/admin/challenges', form);
      setShowCreate(false);
      setForm({ title: '', description: '', type: 'streak', target: 7, startDate: '', endDate: '' });
      fetchChallenges();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const statusLabel = (s) => ({ upcoming: 'Sắp tới', active: 'Đang diễn ra', ended: 'Đã kết thúc' }[s] || s);
  const statusTone = (s) => ({ upcoming: 'amber', active: 'green', ended: 'zinc' }[s] || 'zinc');
  const typeLabel = (t) => ({ streak: 'Streak', exercise: 'Vận động', tea_log: 'Nhật ký trà', body_mind_score: 'Body-Mind Score' }[t] || t);

  if (loading) {
    return <div className="admin-panel p-6"><p className="text-sm text-slate-500">Đang tải...</p></div>;
  }
  if (error) {
    return <div className="admin-panel p-6"><p className="text-sm text-red-600">Lỗi: {error}</p></div>;
  }

  return (
    <div className="admin-panel p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="admin-eyebrow">Quản lý thử thách</p>
          <h2 className="text-xl font-black text-slate-950">Thử thách cộng đồng</h2>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="admin-link-button"
        >
          + Tạo thử thách
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="admin-panel p-4 space-y-3">
          <input
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              className="rounded border border-slate-200 px-3 py-2 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="streak">Streak</option>
              <option value="exercise">Vận động</option>
              <option value="tea_log">Nhật ký trà</option>
              <option value="body_mind_score">Body-Mind Score</option>
            </select>
            <input
              className="rounded border border-slate-200 px-3 py-2 text-sm"
              type="number"
              placeholder="Mục tiêu"
              value={form.target}
              onChange={(e) => setForm({ ...form, target: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="rounded border border-slate-200 px-3 py-2 text-sm"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
            <input
              className="rounded border border-slate-200 px-3 py-2 text-sm"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="admin-link-button">Lưu thử thách</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase text-slate-500">
              <th className="pb-2 pr-4">Tiêu đề</th>
              <th className="pb-2 pr-4">Loại</th>
              <th className="pb-2 pr-4">Mục tiêu</th>
              <th className="pb-2 pr-4">Thời gian</th>
              <th className="pb-2 pr-4">Trạng thái</th>
              <th className="pb-2">Người tham gia</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((ch) => (
              <tr key={ch._id} className="border-b border-slate-100">
                <td className="py-3 pr-4 font-semibold text-slate-800">{ch.title}</td>
                <td className="py-3 pr-4 text-slate-600">{typeLabel(ch.type)}</td>
                <td className="py-3 pr-4 text-slate-600">{ch.target}</td>
                <td className="py-3 pr-4 text-slate-500">
                  {new Date(ch.startDate).toLocaleDateString('vi-VN')} - {new Date(ch.endDate).toLocaleDateString('vi-VN')}
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge tone={statusTone(ch.status)}>{statusLabel(ch.status)}</StatusBadge>
                </td>
                <td className="py-3 text-slate-600">{ch.participants?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
