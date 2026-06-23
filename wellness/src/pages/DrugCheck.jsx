import { useState } from 'react';
import api from '@shared/api';

const INTERACTION_LEVELS = {
  safe: { label: 'An toàn', icon: '✅', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  caution: { label: 'Thận trọng', icon: '⚠️', color: 'text-amberSoft', bg: 'bg-amber-50', border: 'border-amber-200' },
  warning: { label: 'Cảnh báo', icon: '❌', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

export default function DrugCheck() {
  const [manualDrugs, setManualDrugs] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!manualDrugs.trim()) {
      setError('Vui lòng nhập tên thuốc.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const { data } = await api.post('/wellness/drug-check', {
        drugs: manualDrugs.split(',').map((d) => d.trim()).filter(Boolean),
      });
      setResults(data.interactions || []);
    } catch (err) {
      setError('Không thể phân tích đơn thuốc. Vui lòng thử lại sau.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setManualDrugs('');
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Kiểm tra tương tác thuốc</h1>

      <div className="wellness-muted-surface p-4 rounded-xl border-l-4 border-amberSoft">
        <p className="text-sm text-gray-700 font-medium">
          ⚠️ Thông tin chỉ mang tính tham khảo, <strong>KHÔNG</strong> thay thế tư vấn bác sĩ. Vui lòng hỏi ý kiến chuyên gia y tế trước khi dùng.
        </p>
      </div>

      {!results && (
        <div className="wellness-surface p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Nhập tên thuốc bạn đang dùng (cách nhau bằng dấu phẩy)
          </label>
          <textarea
            className="input-field min-h-[100px] resize-none"
            value={manualDrugs}
            onChange={(e) => setManualDrugs(e.target.value)}
            placeholder="VD: Paracetamol, Ibuprofen, Aspirin, Amoxicillin"
          />
        </div>
      )}

      {!results && (
        <button
          onClick={handleAnalyze}
          disabled={analyzing || !manualDrugs.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Đang phân tích...
            </span>
          ) : (
            '🔍 Kiểm tra tương tác'
          )}
        </button>
      )}

      {analyzing && (
        <div className="wellness-surface p-6 text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600 font-medium">Đang phân tích đơn thuốc của bạn...</p>
          <p className="text-xs text-gray-400">Quá trình này có thể mất vài giây</p>
        </div>
      )}

      {error && (
        <div className="wellness-surface p-4 border border-red-200 bg-red-50 rounded-xl">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Kết quả phân tích</h2>
            <button onClick={handleReset} className="text-sm text-primary-600 font-medium">
              Kiểm tra lại
            </button>
          </div>

          {results.length === 0 ? (
            <div className="wellness-surface p-6 text-center space-y-2">
              <div className="text-4xl">✅</div>
              <p className="text-gray-700 font-medium">Không tìm thấy tương tác đáng lo ngại</p>
              <p className="text-sm text-gray-500">Tuy nhiên, hãy luôn tham khảo ý kiến bác sĩ trước khi dùng.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((item, idx) => {
                const level = INTERACTION_LEVELS[item.level] || INTERACTION_LEVELS.safe;
                return (
                  <div key={idx} className={`${level.bg} ${level.border} border rounded-xl p-4 space-y-2`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{level.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800">{item.drugName}</span>
                          <span className="text-gray-400 text-sm">↔</span>
                          <span className="font-semibold text-leaf-600">{item.teaName}</span>
                        </div>
                        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-2 ${level.bg} ${level.color}`}>
                          {level.label}
                        </span>
                      </div>
                    </div>
                    {item.detail && (
                      <p className="text-sm text-gray-600 pl-10">{item.detail}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
