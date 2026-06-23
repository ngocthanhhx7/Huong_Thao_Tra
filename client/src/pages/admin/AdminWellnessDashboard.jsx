import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { MetricCard } from '../../components/admin/AdminUi';

export default function AdminWellnessDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.get('/wellness/admin/dashboard')
      .then((res) => { if (!cancelled) setStats(res.data); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.message || err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="admin-panel p-6">
        <p className="text-sm text-slate-500">Đang tải dữ liệu wellness...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel p-6">
        <p className="text-sm text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-panel p-6 space-y-6">
      <div>
        <p className="admin-eyebrow">Wellness Dashboard</p>
        <h2 className="text-xl font-black text-slate-950">Tổng quan sức khỏe & Pro</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Người dùng wellness" value={stats?.totalUsers ?? 0} />
        <MetricCard label="Pro đang active" value={stats?.activeProUsers ?? 0} />
        <MetricCard label="Tỉ lệ chuyển đổi Pro" value={`${stats?.proConversionRate ?? 0}%`} />
        <MetricCard label="AI Coach dùng/ngày" value={stats?.aiCoachDailyUsage ?? 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="admin-panel p-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Top trà trong nhật ký</h3>
          {stats?.topTeas?.length > 0 ? (
            <ul className="space-y-2">
              {stats.topTeas.map((t, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{t.name}</span>
                  <span className="text-slate-400">{t.count} lần</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
          )}
        </div>

        <div className="admin-panel p-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Thử thách tham gia</h3>
          {stats?.challengeParticipation != null ? (
            <p className="text-2xl font-black text-slate-800">{stats.challengeParticipation} lượt</p>
          ) : (
            <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  );
}
