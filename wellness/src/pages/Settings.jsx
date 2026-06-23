import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@shared/AuthContext';
import api from '@shared/api';

const TIME_SLOTS = [
  { key: 'morning', label: 'Sáng', time: '6-8h', icon: '🌅' },
  { key: 'noon', label: 'Trưa', time: '12-13h', icon: '☀️' },
  { key: 'afternoon', label: 'Chiều', time: '15-16h', icon: '🌤️' },
  { key: 'evening', label: 'Tối', time: '20-22h', icon: '🌙' },
];

const DEFAULT_SLOTS = TIME_SLOTS.reduce((acc, s) => {
  acc[s.key] = { enabled: true, teaName: '', pushEnabled: false };
  return acc;
}, {});

const DEFAULT_NOTIFY = {
  checkinReminder: true,
  streakAlerts: true,
  weatherAlerts: false,
  proExpiryAlerts: true,
};

export default function Settings() {
  const { user } = useAuth();
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [notify, setNotify] = useState(DEFAULT_NOTIFY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get('/wellness/settings');
      if (data.ritual) {
        const merged = { ...DEFAULT_SLOTS };
        TIME_SLOTS.forEach((s) => {
          if (data.ritual[s.key]) {
            merged[s.key] = { ...merged[s.key], ...data.ritual[s.key] };
          }
        });
        setSlots(merged);
      }
      if (data.notifications) {
        setNotify({ ...DEFAULT_NOTIFY, ...data.notifications });
      }
    } catch {
      setError('Không thể tải cài đặt. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggleSlot = (key) => {
    setSlots((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const handleTogglePush = (key) => {
    setSlots((prev) => ({
      ...prev,
      [key]: { ...prev[key], pushEnabled: !prev[key].pushEnabled },
    }));
  };

  const handleTeaChange = (key, value) => {
    setSlots((prev) => ({
      ...prev,
      [key]: { ...prev[key], teaName: value },
    }));
  };

  const handleToggleNotify = (key) => {
    setNotify((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveRitual = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put('/wellness/settings/ritual', { slots });
      setSuccess('Đã lưu cài đặt nghi thức.');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Không thể lưu cài đặt. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !slots) {
    return (
      <div className="p-4 space-y-4">
        <div className="wellness-surface p-6 text-center space-y-3">
          <div className="text-4xl">😕</div>
          <p className="text-gray-600">{error}</p>
          <button onClick={fetchSettings} className="btn-primary text-sm py-2">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Cài đặt</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Nghi thức hàng ngày</h2>
        <p className="text-sm text-gray-500">Thiết lập thời gian và loại trà cho từng buổi trong ngày.</p>

        <div className="space-y-3">
          {TIME_SLOTS.map((slot) => (
            <div key={slot.key} className={`wellness-surface p-4 space-y-3 transition-opacity ${!slots[slot.key].enabled ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{slot.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{slot.label}</h3>
                    <p className="text-xs text-gray-500">{slot.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleSlot(slot.key)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    slots[slot.key].enabled ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Bật/tắt ${slot.label}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                      slots[slot.key].enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {slots[slot.key].enabled && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Trà gợi ý
                    </label>
                    <input
                      className="input-field text-sm"
                      value={slots[slot.key].teaName}
                      onChange={(e) => handleTeaChange(slot.key, e.target.value)}
                      placeholder={`VD: Trà sen ${slot.label.toLowerCase()}`}
                    />
                  </div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-600">Thông báo đẩy</span>
                    <button
                      onClick={() => handleTogglePush(slot.key)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        slots[slot.key].pushEnabled ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Thông báo ${slot.label}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          slots[slot.key].pushEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </label>
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveRitual}
          disabled={saving}
          className="btn-primary w-full text-sm py-3 disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Đang lưu...
            </span>
          ) : (
            '💾 Lưu nghi thức'
          )}
        </button>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Thông báo</h2>
        <div className="wellness-surface divide-y divide-gray-100">
          <label className="flex items-center justify-between p-4 cursor-pointer">
            <span className="text-sm text-gray-700">Nhắc nhở check-in hàng ngày</span>
            <button
              onClick={() => handleToggleNotify('checkinReminder')}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notify.checkinReminder ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Nhắc nhở check-in"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notify.checkinReminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between p-4 cursor-pointer">
            <span className="text-sm text-gray-700">Cảnh báo chuỗi streak</span>
            <button
              onClick={() => handleToggleNotify('streakAlerts')}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notify.streakAlerts ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Cảnh báo streak"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notify.streakAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between p-4 cursor-pointer">
            <span className="text-sm text-gray-700">Cảnh báo thời tiết</span>
            <button
              onClick={() => handleToggleNotify('weatherAlerts')}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notify.weatherAlerts ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Cảnh báo thời tiết"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notify.weatherAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between p-4 cursor-pointer">
            <span className="text-sm text-gray-700">Cảnh báo hết hạn Pro</span>
            <button
              onClick={() => handleToggleNotify('proExpiryAlerts')}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notify.proExpiryAlerts ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Cảnh báo hết hạn Pro"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notify.proExpiryAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Hồ sơ</h2>
        <Link
          to="/wellness/profile"
          className="wellness-surface p-4 flex items-center gap-3 active:scale-[0.98] transition-transform no-underline"
        >
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
            {(user?.name || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
          <span className="text-gray-400 text-lg">›</span>
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Về ứng dụng</h2>
        <div className="wellness-surface divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-700">Phiên bản</span>
            <span className="text-sm text-gray-500 font-mono">1.0.0</span>
          </div>
          <a
            href="mailto:hotro@huongthaotra.vn"
            className="flex items-center justify-between p-4 no-underline active:bg-gray-50"
          >
            <span className="text-sm text-gray-700">Liên hệ hỗ trợ</span>
            <span className="text-sm text-primary-600">hotro@huongthaotra.vn</span>
          </a>
        </div>
      </section>
    </div>
  );
}
