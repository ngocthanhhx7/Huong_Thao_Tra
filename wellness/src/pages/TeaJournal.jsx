import { useState, useEffect, useCallback } from 'react';
import api from '@shared/api';

const STREAK_BADGES = [
  { days: 7, name: 'Trà Nhân Mới' },
  { days: 14, name: 'Trà Nhân Bạc' },
  { days: 30, name: 'Trà Nhân Vàng' },
  { days: 60, name: 'Trà Nhân Kim Cương' },
  { days: 100, name: 'Trà Nhân Huyền Thoại' },
];

const MOODS = [
  { emoji: '😊', label: 'Vui vẻ', value: 'great' },
  { emoji: '😌', label: 'Bình yên', value: 'good' },
  { emoji: '😐', label: 'Bình thường', value: 'okay' },
  { emoji: '😔', label: 'Buồn', value: 'bad' },
  { emoji: '😤', label: 'Căng thẳng', value: 'awful' },
];

const MOOD_BY_VALUE = MOODS.reduce((acc, mood) => {
  acc[mood.value] = mood;
  return acc;
}, {});

const FEELINGS = [
  'tỉnh táo', 'buồn ngủ', 'ấm bụng', 'thư giãn',
  'đau đầu', 'khó chịu', 'dễ chịu', 'tập trung',
];

function groupByDate(entries) {
  const map = {};
  entries.forEach((e) => {
    const date = e.drunkAt?.split('T')[0] || e.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
    if (!map[date]) map[date] = [];
    map[date].push(e);
  });
  return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
}

export default function TeaJournal() {
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [teas, setTeas] = useState([]);
  const [teaSearch, setTeaSearch] = useState('');
  const [form, setForm] = useState({
    teaName: '',
    time: new Date().toTimeString().slice(0, 5),
    mood: '',
    rating: 0,
    feelings: [],
    note: '',
    photo: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchJournal = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/wellness/journal');
      setJournal(Array.isArray(data) ? { entries: data, streak: 0 } : data);
    } catch {
      setError('Không thể tải nhật ký trà. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJournal();
  }, [fetchJournal]);

  useEffect(() => {
    if (showForm) {
      api.get('/teas').then(({ data }) => setTeas(data)).catch(() => {});
    }
  }, [showForm]);

  const filteredTeas = teas.filter((t) =>
    t.name?.toLowerCase().includes(teaSearch.toLowerCase())
  );

  const currentStreak = journal?.streak || 0;
  const badge = [...STREAK_BADGES].reverse().find((b) => currentStreak >= b.days);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeeling = (feeling) => {
    setForm((prev) => ({
      ...prev,
      feelings: prev.feelings.includes(feeling)
        ? prev.feelings.filter((f) => f !== feeling)
        : [...prev.feelings, feeling],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.teaName.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        teaName: form.teaName,
        date: new Date().toISOString().slice(0, 10),
        time: form.time,
        mood: form.mood,
        rating: form.rating,
        bodyFeelings: form.feelings,
        note: form.note,
      };
      if (form.photo) {
        payload.photo = form.photo;
      }
      await api.post('/wellness/journal', payload);
      setShowForm(false);
      setForm({
        teaName: '',
        time: new Date().toTimeString().slice(0, 5),
        mood: '',
        rating: 0,
        feelings: [],
        note: '',
        photo: null,
      });
      fetchJournal();
    } catch {
      setError('Không thể lưu nhật ký. Thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/wellness/journal/${id}`);
      fetchJournal();
    } catch {
      setError('Không thể xóa mục này.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !journal) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-3">{error}</p>
        <button onClick={fetchJournal} className="text-primary-600 underline">
          Thử lại
        </button>
      </div>
    );
  }

  const groups = journal?.entries ? groupByDate(journal.entries) : [];

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-primary-600 to-leaf-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔥</span>
          <div>
            <p className="text-3xl font-bold">Chuỗi {currentStreak} ngày</p>
            {badge && (
              <span className="inline-block mt-1 px-3 py-0.5 bg-white/20 rounded-full text-sm">
                {badge.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🍵</p>
          <p className="text-lg font-medium">Chưa có mục nhật ký nào</p>
          <p className="text-sm mt-1">Nhấn nút &quot;+ Thêm&quot; để bắt đầu ghi nhật ký trà</p>
        </div>
      ) : (
        <div className="px-4 mt-4 space-y-6">
          {groups.map(([date, entries]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                {new Date(date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry._id || entry.id}
                    className="bg-white rounded-2xl p-4 shadow-sm relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">{entry.drunkAt ? new Date(entry.drunkAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                          <span className="font-semibold text-gray-800 truncate">
                            {entry.teaName || entry.tea?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          {entry.mood && MOOD_BY_VALUE[entry.mood] && (
                            <span className="text-xl" title={MOOD_BY_VALUE[entry.mood].label}>
                              {MOOD_BY_VALUE[entry.mood].emoji}
                            </span>
                          )}
                          {entry.rating > 0 && (
                            <span className="text-amberSoft text-sm">
                              {'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}
                            </span>
                          )}
                        </div>
                        {(entry.bodyFeelings || entry.feelings)?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {(entry.bodyFeelings || entry.feelings).map((f) => (
                              <span
                                key={f}
                                className="px-2 py-0.5 bg-leaf-50 text-leaf-800 rounded-full text-xs"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                        {entry.note && (
                          <p className="text-sm text-gray-600 line-clamp-2">{entry.note}</p>
                        )}
                      </div>
                      {entry.photo && (
                        <img
                          src={entry.photo}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover ml-3 flex-shrink-0"
                        />
                      )}
                      <button
                        onClick={() => handleDelete(entry._id || entry.id)}
                        disabled={deleting === (entry._id || entry.id)}
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        title="Xóa"
                      >
                        {deleting === (entry._id || entry.id) ? (
                          <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          '✕'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-40 hover:bg-primary-700 transition-colors active:scale-95"
      >
        +
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Thêm nhật ký trà</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên trà</label>
                <input
                  type="text"
                  value={form.teaName}
                  onChange={(e) => handleChange('teaName', e.target.value)}
                  onFocus={() => setTeaSearch(form.teaName)}
                  placeholder="Nhập tên trà..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
                {teaSearch && filteredTeas.length > 0 && (
                  <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                    {filteredTeas.map((t) => (
                      <button
                        key={t._id || t.id}
                        type="button"
                        onClick={() => {
                          handleChange('teaName', t.name);
                          setTeaSearch('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-leaf-50 text-sm"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tâm trạng</label>
                <div className="flex gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => handleChange('mood', m.value)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        form.mood === m.value
                          ? 'bg-primary-100 ring-2 ring-primary-500 scale-110'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleChange('rating', star)}
                      className={`text-2xl transition-all ${
                        star <= form.rating ? 'text-amberSoft scale-110' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cảm nhận cơ thể</label>
                <div className="flex flex-wrap gap-2">
                  {FEELINGS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeeling(f)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        form.feelings.includes(f)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={form.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                  placeholder="Cảm nhận của bạn về tách trà này..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChange('photo', e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-leaf-50 file:text-primary-600 hover:file:bg-leaf-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !form.teaName.trim()}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
              >
                {submitting ? 'Đang lưu...' : 'Lưu nhật ký'}
              </button>
            </form>
          </div>

          <style>{`
            @keyframes slide-up {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            .animate-slide-up {
              animation: slide-up 0.3s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
