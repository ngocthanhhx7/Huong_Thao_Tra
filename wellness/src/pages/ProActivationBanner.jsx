import { useEffect, useState } from 'react';
import api from '@shared/api';

export default function ProActivationBanner() {
  const [status, setStatus] = useState('loading');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.post('/wellness/pro/activate-from-orders')
      .then((res) => {
        if (!cancelled) {
          if (res.data?.activated) {
            setStatus('activated');
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
          } else {
            setStatus('hidden');
          }
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('hidden');
      });

    return () => { cancelled = true; };
  }, []);

  if (status === 'loading' || status === 'hidden' || !visible) return null;

  return (
    <div className="mx-4 mt-4 wellness-surface border-2 border-primary-500 bg-gradient-to-r from-primary-50 to-leaf-50 rounded-2xl p-4 animate-slide-down">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">🎉</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-primary-700">
            Chúc mừng! Bạn được tặng 30 ngày dùng Pro miễn phí!
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Trải nghiệm tất cả tính năng cao cấp của Hương Thảo Trà.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-600 shrink-0"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
