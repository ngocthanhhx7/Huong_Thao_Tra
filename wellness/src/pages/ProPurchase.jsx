import { useState, useEffect, useCallback } from 'react';
import api from '@shared/api';

const PLANS = [
  {
    id: 'pro_personal_1m',
    name: 'Pro Cá Nhân 1 tháng',
    price: '39.000đ',
    period: '/tháng',
    description: 'Truy cập tất cả tính năng Pro',
    badge: null,
  },
  {
    id: 'pro_personal_6m',
    name: 'Pro Cá Nhân 6 tháng',
    price: '180.000đ',
    period: '/6 tháng',
    description: 'Tiết kiệm 23% so với gói tháng',
    badge: 'Tiết kiệm 23%',
  },
  {
    id: 'pro_family',
    name: 'Pro Gia Đình',
    price: '180.000đ',
    period: '/tháng',
    description: 'Tối đa 4 thành viên',
    badge: 'Gia đình',
  },
];

export default function ProPurchase() {
  const [proStatus, setProStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statusRes, historyRes] = await Promise.all([
        api.get('/wellness/pro/status'),
        api.get('/wellness/pro/history'),
      ]);
      setProStatus(statusRes.data);
      setHistory(Array.isArray(historyRes.data) ? historyRes.data : historyRes.data?.history || []);
    } catch {
      setError('Không thể tải thông tin gói Pro. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    setPurchasing(true);
    setError('');
    try {
      const { data } = await api.post('/wellness/pro/purchase', {
        planId: selectedPlan.id,
      });
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        fetchStatus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setPurchasing(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !proStatus) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={fetchStatus} className="btn-primary">Thử lại</button>
      </div>
    );
  }

  const isPro = proStatus?.isPro;

  return (
    <div className="px-4 py-6 space-y-5 safe-bottom">
      <h1 className="text-xl font-extrabold text-secondary">Gói Pro</h1>

      {isPro ? (
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⭐</span>
            <h2 className="text-lg font-bold">Pro đang kích hoạt</h2>
          </div>
          <p className="text-sm opacity-90">Gói: {proStatus?.planName || 'Pro Cá Nhân'}</p>
          {proStatus?.expiresAt && (
            <div className="mt-3 bg-white/20 rounded-xl p-3">
              <p className="text-xs opacity-80">Ngày hết hạn</p>
              <p className="text-base font-bold">{formatDate(proStatus.expiresAt)}</p>
            </div>
          )}
          {proStatus?.daysRemaining != null && (
            <p className="mt-2 text-sm font-semibold">
              Còn {proStatus.daysRemaining} ngày sử dụng
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="text-center">
            <p className="text-sm text-gray-500">Nâng cấp lên Pro để mở khóa tất cả tính năng</p>
          </div>

          <div className="space-y-3">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'border-primary-600 bg-leaf-50'
                    : 'border-gray-200 bg-white hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-primary-600">{plan.price}</p>
                    <p className="text-[10px] text-gray-400">{plan.period}</p>
                  </div>
                </div>
                {plan.badge && (
                  <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    selectedPlan?.id === plan.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-amber-100 text-amberSoft'
                  }`}>
                    {plan.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={!selectedPlan || purchasing}
            className="btn-primary w-full text-center"
          >
            {purchasing ? 'Đang xử lý...' : selectedPlan ? `Mua ${selectedPlan.name}` : 'Chọn gói để tiếp tục'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Thanh toán an toàn qua PayOS. Hủy bất cứ lúc nào.
          </p>
        </>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Lịch sử giao dịch</h3>
          <div className="space-y-2">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {entry.planName || entry.plan || 'Gói Pro'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(entry.activatedAt || entry.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-600">
                    {entry.amount ? `${entry.amount.toLocaleString()}đ` : '—'}
                  </p>
                  <p className={`text-[10px] font-medium ${
                    entry.status === 'active' ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {entry.status === 'active' ? 'Đang dùng' : entry.status === 'expired' ? 'Hết hạn' : entry.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && !isPro && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm">Chưa có giao dịch nào.</p>
        </div>
      )}
    </div>
  );
}
