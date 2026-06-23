import { useState, useEffect, useCallback } from 'react';
import api from '@shared/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PERIODS = ['Tuần này', 'Tháng này'];

function TrendArrow({ current, previous, reverse }) {
  if (current == null || previous == null || previous === 0) return null;
  const diff = current - previous;
  const improved = reverse ? diff < 0 : diff > 0;
  if (Math.abs(diff) < 0.01) return null;
  return (
    <span className={`text-xs font-medium ml-2 ${improved ? 'text-green-600' : 'text-red-500'}`}>
      {improved ? '↑' : '↓'} {Math.abs(diff).toFixed(1)}
      {diff !== Math.round(diff) ? '' : ''}
    </span>
  );
}

function SummaryCard({ label, value, unit, prevValue, reverse, icon }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-800">{value ?? '--'}</span>
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
        {prevValue != null && (
          <TrendArrow current={value} previous={prevValue} reverse={reverse} />
        )}
      </div>
    </div>
  );
}

export default function Reports() {
  const [period, setPeriod] = useState('Tuần này');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = period === 'Tuần này'
        ? '/wellness/reports/weekly'
        : '/wellness/reports/monthly';
      const { data: res } = await api.get(endpoint);
      setData(res);
    } catch {
      setError('Không thể tải báo cáo. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const avgScore = data?.avgScore ?? data?.bodyMindScore ?? 0;
  const prevAvgScore = data?.prevAvgScore ?? data?.prevBodyMindScore ?? null;
  const totalLogs = data?.totalLogs ?? data?.totalTeaLogs ?? 0;
  const favoriteTea = data?.favoriteTea ?? '--';
  const totalExercise = data?.totalExercise ?? data?.totalExerciseMinutes ?? 0;
  const prevTotalExercise = data?.prevTotalExercise ?? null;

  const sleepData = data?.sleepTrend || data?.sleep || [];
  const stressData = data?.stressTrend || data?.stress || [];
  const weightData = data?.weightTrend || data?.weight || [];

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex gap-2 mb-2">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === p
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-600 shadow-sm hover:bg-gray-50"
        >
          Tùy chỉnh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          label="Chỉ số Thân-Tâm"
          value={avgScore}
          unit="/100"
          prevValue={prevAvgScore}
          icon="🧘"
        />
        <SummaryCard
          label="Nhật ký trà"
          value={totalLogs}
          unit="lần"
          icon="🍵"
        />
        <SummaryCard
          label="Trà yêu thích"
          value={favoriteTea}
          unit=""
          icon="💚"
        />
        <SummaryCard
          label="Phút vận động"
          value={totalExercise}
          unit="phút"
          prevValue={prevTotalExercise}
          icon="🏃"
        />
      </div>

      {sleepData.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Giấc ngủ (giờ)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3f7f32"
                strokeWidth={2}
                dot={{ r: 4, fill: '#3f7f32' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {stressData.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Căng thẳng (1-10)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" domain={[0, 10]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#d99b25"
                strokeWidth={2}
                dot={{ r: 4, fill: '#d99b25' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {weightData.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Cân nặng (kg)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f7d43"
                strokeWidth={2}
                dot={{ r: 4, fill: '#4f7d43' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <button
        onClick={handleExportPDF}
        disabled={exporting}
        className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
      >
        {exporting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Đang phát triển...
          </>
        ) : (
          'Xuất PDF'
        )}
      </button>
    </div>
  );
}
