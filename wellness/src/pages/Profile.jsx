import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/AuthContext';
import api from '@shared/api';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

const HEALTH_GOALS = [
  'Tăng cường miễn dịch',
  'Thư giãn, giảm stress',
  'Cải thiện giấc ngủ',
  'Hỗ trợ tiêu hóa',
  'Giảm cân',
  'Tăng năng lượng',
  'Làm đẹp da',
];

const formatPreferences = (preferences) => (
  Array.isArray(preferences) ? preferences.join(', ') : preferences || ''
);

const parsePreferences = (preferences) => (
  preferences
    ? preferences.split(',').map((item) => item.trim()).filter(Boolean)
    : []
);

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get('/auth/profile');
      setProfile(data);
      setForm({
        name: data.name || '',
        gender: data.gender || 'other',
        preferences: formatPreferences(data.preferences),
        age: data.age?.toString() || '',
        sleepTime: data.sleepTime || '',
        stressLevel: data.stressLevel || '',
        healthGoal: data.healthGoal || '',
      });
    } catch {
      setError('Không thể tải hồ sơ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        name: form.name.trim(),
        gender: form.gender,
        preferences: parsePreferences(form.preferences),
        age: parseInt(form.age, 10) || null,
        sleepTime: form.sleepTime,
        stressLevel: form.stressLevel,
        healthGoal: form.healthGoal,
      };
      const { data } = await api.put('/auth/profile', payload);
      setProfile(data);
      setForm({
        name: data.name || '',
        gender: data.gender || 'other',
        preferences: formatPreferences(data.preferences),
        age: data.age?.toString() || '',
        sleepTime: data.sleepTime || '',
        stressLevel: data.stressLevel || '',
        healthGoal: data.healthGoal || '',
      });
      if (data.name) {
        setUser((prev) => ({ ...prev, name: data.name }));
      }
      setEditing(false);
      setSuccess('Đã cập nhật hồ sơ.');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      name: profile.name || '',
      gender: profile.gender || 'other',
      preferences: formatPreferences(profile.preferences),
      age: profile.age?.toString() || '',
      sleepTime: profile.sleepTime || '',
      stressLevel: profile.stressLevel || '',
      healthGoal: profile.healthGoal || '',
    });
    setEditing(false);
    setError(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-4 space-y-4">
        <div className="wellness-surface p-6 text-center space-y-3">
          <div className="text-4xl">😕</div>
          <p className="text-gray-600">{error}</p>
          <button onClick={fetchProfile} className="btn-primary text-sm py-2">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const initials = (profile?.name || user?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-4 pb-24 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Hồ sơ</h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-primary-600 font-medium"
          >
            ✏️ Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !form?.name.trim()}
              className="btn-primary text-sm py-1.5 px-4 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button onClick={handleCancel} className="btn-outline text-sm py-1.5 px-4">
              Hủy
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <div className="wellness-surface p-6 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-2xl">
          {initials}
        </div>
        {!editing ? (
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800">{profile?.name || user?.name}</h2>
            <p className="text-sm text-gray-500">{profile?.email || user?.email}</p>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tên</label>
              <input
                className="input-field text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tên của bạn"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Giới tính</label>
              <div className="flex gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g.value })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.gender === g.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Hồ sơ sức khỏe</h2>
        <div className="wellness-surface divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-500">Tuổi</span>
            {editing ? (
              <input
                className="w-20 text-right text-sm font-medium text-gray-800 bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary-500"
                type="number"
                min="0"
                max="120"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            ) : (
              <span className="text-sm font-medium text-gray-800">{profile?.age || '—'}</span>
            )}
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-500">Giờ ngủ</span>
            {editing ? (
              <input
                className="w-24 text-right text-sm font-medium text-gray-800 bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary-500"
                value={form.sleepTime}
                onChange={(e) => setForm({ ...form, sleepTime: e.target.value })}
                placeholder="VD: 22:00"
              />
            ) : (
              <span className="text-sm font-medium text-gray-800">{profile?.sleepTime || '—'}</span>
            )}
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-500">Mức stress</span>
            {editing ? (
              <select
                className="text-right text-sm font-medium text-gray-800 bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary-500"
                value={form.stressLevel}
                onChange={(e) => setForm({ ...form, stressLevel: e.target.value })}
              >
                <option value="">Chưa đặt</option>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            ) : (
              <span className="text-sm font-medium text-gray-800">
                {profile?.stressLevel === 'low' && 'Thấp'}
                {profile?.stressLevel === 'medium' && 'Trung bình'}
                {profile?.stressLevel === 'high' && 'Cao'}
                {!profile?.stressLevel && '—'}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-500">Mục tiêu sức khỏe</span>
            {editing ? (
              <select
                className="text-right text-sm font-medium text-gray-800 bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary-500 max-w-[60%]"
                value={form.healthGoal}
                onChange={(e) => setForm({ ...form, healthGoal: e.target.value })}
              >
                <option value="">Chưa đặt</option>
                {HEALTH_GOALS.map((goal) => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-medium text-gray-800">{profile?.healthGoal || '—'}</span>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Nhanh</h2>
        <div className="wellness-surface divide-y divide-gray-100">
          <Link
            to="/pro"
            className="flex items-center justify-between p-4 no-underline active:bg-gray-50"
          >
            <span className="text-sm text-gray-700">⭐ Gói Pro</span>
            <span className="text-gray-400 text-lg">›</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center justify-between p-4 no-underline active:bg-gray-50"
          >
            <span className="text-sm text-gray-700">⚙️ Cài đặt</span>
            <span className="text-gray-400 text-lg">›</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-between p-4 w-full text-left active:bg-gray-50"
          >
            <span className="text-sm text-red-500">🚪 Đăng xuất</span>
            <span className="text-gray-400 text-lg">›</span>
          </button>
        </div>
      </section>
    </div>
  );
}
