import { useState, useEffect, useCallback } from 'react';
import api from '@shared/api';

const CATEGORIES = {
  80: { label: 'Rực rỡ', color: '#3f7f32', bg: '#f4fbef' },
  60: { label: 'Cân bằng', color: '#5b9f45', bg: '#f7faf4' },
  40: { label: 'Hơi căng', color: '#d99b25', bg: '#fffaf0' },
  0: { label: 'Cần chăm sóc', color: '#e53e3e', bg: '#fff5f5' },
};

function getCategory(score) {
  const thresholds = Object.keys(CATEGORIES).map(Number).sort((a, b) => b - a);
  for (const t of thresholds) {
    if (score >= t) return CATEGORIES[t];
  }
  return CATEGORIES[0];
}

function CircularGauge({ score }) {
  const cat = getCategory(score);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 168 168">
          <circle
            cx="84"
            cy="84"
            r={radius}
            className="stroke-gray-200"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="84"
            cy="84"
            r={radius}
            stroke={cat.color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-secondary">{score}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
      <span
        className="mt-2 px-4 py-1 rounded-full text-sm font-semibold"
        style={{ backgroundColor: cat.bg, color: cat.color }}
      >
        {cat.label}
      </span>
    </div>
  );
}

function Sparkline({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 200;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10">
      <polyline
        points={points.join(' ')}
        className="stroke-primary-600"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoodCalendar({ logs }) {
  const moodMap = { happy: 4, calm: 3, neutral: 2, sad: 1, anxious: 0 };
  const moodColors = {
    happy: '#3f7f32',
    calm: '#5b9f45',
    neutral: '#a0aec0',
    sad: '#d99b25',
    anxious: '#e53e3e',
  };
  const moodLabels = {
    happy: '😊', calm: '😌', neutral: '😐', sad: '😢', anxious: '😰',
  };

  const today = new Date();
  const days = [];
  const logsByDate = {};
  (logs || []).forEach((l) => {
    const d = new Date(l.date).toISOString().slice(0, 10);
    logsByDate[d] = l;
  });

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3">Tâm trạng 28 ngày</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
          <div key={d} className="text-[10px] text-center text-gray-400 font-medium">{d}</div>
        ))}
        {days.map((dateStr) => {
          const entry = logsByDate[dateStr];
          const mood = entry?.mood || 'neutral';
          return (
            <div
              key={dateStr}
              className="w-full aspect-square rounded-md flex items-center justify-center text-xs"
              style={{ backgroundColor: entry ? moodColors[mood] + '30' : '#f1f5f9' }}
              title={dateStr}
            >
              {entry ? moodLabels[mood] : ''}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(moodLabels).map(([key, emoji]) => (
          <div key={key} className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: moodColors[key] }} />
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandExplain, setExpandExplain] = useState(false);
  const [trendData, setTrendData] = useState([]);

  const [quickForm, setQuickForm] = useState({
    sleep: '', stress: '', weight: '', water: '', exercise: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, logsRes] = await Promise.all([
        api.get('/wellness/health/summary'),
        api.get('/wellness/health/logs'),
      ]);
      setSummary(summaryRes.data);
      const logsData = Array.isArray(logsRes.data) ? logsRes.data : logsRes.data?.logs || [];
      setLogs(logsData);

      const trendScores = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const dayLog = logsData.find((l) => {
          const ld = new Date(l.date).toISOString().slice(0, 10);
          return ld === dateStr;
        });
        const s = dayLog?.score ?? (i === 0 ? summaryRes.data?.score : null);
        if (s !== null && s !== undefined) trendScores.push(s);
      }
      setTrendData(trendScores);
    } catch (err) {
      setError('Không thể tải dữ liệu sức khỏe. Vui lòng thử lại.');
      setSummary({ score: 0, category: 'Cần chăm sóc' });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPro = useCallback(() => {
    api.get('/wellness/pro/status').catch(() => {});
  }, []);

  useEffect(() => {
    fetchData();
    fetchPro();
  }, [fetchData, fetchPro]);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    const payload = {};
    if (quickForm.sleep) payload.sleep = Number(quickForm.sleep);
    if (quickForm.stress) payload.stress = Number(quickForm.stress);
    if (quickForm.weight) payload.weight = Number(quickForm.weight);
    if (quickForm.water) payload.water = Number(quickForm.water);
    if (quickForm.exercise) payload.exercise = Number(quickForm.exercise);

    if (Object.keys(payload).length === 0) return;

    setSubmitting(true);
    try {
      await api.post('/wellness/health/log', { ...payload, date: new Date().toISOString() });
      setQuickForm({ sleep: '', stress: '', weight: '', water: '', exercise: '' });
      fetchData();
    } catch {
      setError('Không thể lưu chỉ số. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={fetchData} className="btn-primary">Thử lại</button>
      </div>
    );
  }

  const score = summary?.score ?? 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayLog = logs.find((l) => {
    const ld = new Date(l.date).toISOString().slice(0, 10);
    return ld === todayStr;
  });

  return (
    <div className="px-4 py-6 space-y-5 safe-bottom">
      <h1 className="text-xl font-extrabold text-secondary">Sức khỏe của bạn</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center">
        <CircularGauge score={score} />

        <button
          onClick={() => setExpandExplain(!expandExplain)}
          className="mt-4 text-xs text-primary-600 font-semibold hover:underline"
        >
          {expandExplain ? 'Ẩn cách tính điểm ▲' : 'Cách tính điểm ▼'}
        </button>

        {expandExplain && (
          <div className="mt-3 w-full bg-leaf-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-gray-700">Điểm Body-Mind được tính dựa trên:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Giấc ngủ</strong> – thời lượng và chất lượng (0-20 điểm)</li>
              <li><strong>Mức độ căng thẳng</strong> – tự đánh giá (0-20 điểm)</li>
              <li><strong>Cân nặng & BMI</strong> – so với chỉ số lý tưởng (0-15 điểm)</li>
              <li><strong>Uống nước</strong> – đủ 2 lít/ngày (0-15 điểm)</li>
              <li><strong>Vận động</strong> – phút tập mỗi ngày (0-15 điểm)</li>
              <li><strong>Tâm trạng</strong> – cảm xúc trong ngày (0-15 điểm)</li>
            </ul>
          </div>
        )}
      </div>

      {trendData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Xu hướng 7 ngày</h3>
          <Sparkline data={trendData} />
          <div className="flex justify-between mt-1">
            {trendData.map((v, i) => (
              <span key={i} className="text-[10px] text-gray-400">{v}</span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Thêm chỉ số hôm nay</h3>
        <form onSubmit={handleQuickAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Giấc ngủ (giờ)</label>
              <input
                type="number"
                className="input-field text-sm py-2"
                placeholder="7.5"
                step="0.5"
                min="0"
                max="24"
                value={quickForm.sleep}
                onChange={(e) => setQuickForm({ ...quickForm, sleep: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Căng thẳng (1-10)</label>
              <input
                type="number"
                className="input-field text-sm py-2"
                placeholder="5"
                min="1"
                max="10"
                value={quickForm.stress}
                onChange={(e) => setQuickForm({ ...quickForm, stress: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Cân nặng (kg)</label>
              <input
                type="number"
                className="input-field text-sm py-2"
                placeholder="65"
                step="0.1"
                value={quickForm.weight}
                onChange={(e) => setQuickForm({ ...quickForm, weight: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Nước (ml)</label>
              <input
                type="number"
                className="input-field text-sm py-2"
                placeholder="2000"
                min="0"
                step="100"
                value={quickForm.water}
                onChange={(e) => setQuickForm({ ...quickForm, water: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Vận động (phút)</label>
              <input
                type="number"
                className="input-field text-sm py-2"
                placeholder="30"
                min="0"
                value={quickForm.exercise}
                onChange={(e) => setQuickForm({ ...quickForm, exercise: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full text-sm py-2.5">
            {submitting ? 'Đang lưu...' : 'Lưu chỉ số'}
          </button>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-2">
              {error}
            </div>
          )}
        </form>
      </div>

      {todayLog && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Chỉ số hôm nay</h3>
          <div className="grid grid-cols-2 gap-3">
            {todayLog.sleep != null && (
              <div className="bg-leaf-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Giấc ngủ</p>
                <p className="text-lg font-bold text-secondary">{todayLog.sleep}h</p>
              </div>
            )}
            {todayLog.stress != null && (
              <div className="bg-leaf-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Căng thẳng</p>
                <p className="text-lg font-bold text-secondary">{todayLog.stress}/10</p>
              </div>
            )}
            {todayLog.weight != null && (
              <div className="bg-leaf-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Cân nặng</p>
                <p className="text-lg font-bold text-secondary">{todayLog.weight}kg</p>
              </div>
            )}
            {todayLog.water != null && (
              <div className="bg-leaf-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Nước</p>
                <p className="text-lg font-bold text-secondary">{todayLog.water}ml</p>
              </div>
            )}
            {todayLog.exercise != null && (
              <div className="bg-leaf-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Vận động</p>
                <p className="text-lg font-bold text-secondary">{todayLog.exercise}ph</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <MoodCalendar logs={logs} />
      </div>

      {logs.length === 0 && !error && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">🌿</p>
          <p className="text-sm">Chưa có dữ liệu sức khỏe.</p>
          <p className="text-xs mt-1">Thêm chỉ số đầu tiên của bạn ở trên!</p>
        </div>
      )}
    </div>
  );
}
