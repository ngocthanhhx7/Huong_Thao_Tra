import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isStandalone() {
  if (typeof navigator === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
}

export default function PwaGate() {
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isStandalone()) {
      navigate('/wellness/dashboard', { replace: true });
      return;
    }
    if (!isIOS()) {
      navigate('/wellness/dashboard', { replace: true });
      return;
    }
    const flag = localStorage.getItem('pwa_installed');
    if (flag === 'true') {
      navigate('/wellness/dashboard', { replace: true });
      return;
    }
    setShowGuide(true);
    setChecking(false);
  }, [navigate]);

  const handleInstalled = () => {
    localStorage.setItem('pwa_installed', 'true');
    navigate('/wellness/dashboard', { replace: true });
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-leaf-50">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!showGuide) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-50 to-cream flex flex-col items-center justify-center px-6 py-10 safe-bottom">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-4">
          HTT
        </div>

        <h1 className="text-2xl font-extrabold text-secondary text-center leading-tight mb-1">
          Hương Thảo Trà Wellness
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Ứng dụng chăm sóc sức khỏe toàn diện
        </p>

        <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-primary-600 mb-5 text-center">
            Cài đặt ứng dụng lên iPhone
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-leaf-50 flex items-center justify-center text-lg shrink-0 mt-0.5">
                📤
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Bước 1</p>
                <p className="text-sm text-gray-600">
                  Nhấn nút <span className="inline-block bg-gray-100 rounded px-1.5 py-0.5 text-xs font-medium">Chia sẻ</span> 📤 ở thanh công cụ Safari
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-leaf-50 flex items-center justify-center text-lg shrink-0 mt-0.5">
                📱
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Bước 2</p>
                <p className="text-sm text-gray-600">
                  Cuộn xuống và chọn <span className="font-medium text-primary-600">Thêm vào Màn hình chính</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-leaf-50 flex items-center justify-center text-lg shrink-0 mt-0.5">
                ✅
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Bước 3</p>
                <p className="text-sm text-gray-600">
                  Nhấn <span className="font-medium">Thêm</span> ở góc trên bên phải
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-8">
          <div className="w-full h-48 rounded-xl bg-gradient-to-b from-white to-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-3 right-2 flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                ↪
              </div>
            </div>
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs">
                ▶
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center text-white text-xs">
                +
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center text-white text-xs">
                ↑
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs">
                ←
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs animate-pulse">
                📤
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-12">Thanh công cụ Safari</p>
          </div>
        </div>

        <button
          onClick={handleInstalled}
          className="btn-primary w-full text-center"
        >
          Tôi đã cài xong
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Sau khi cài đặt, mở ứng dụng từ Màn hình chính để có trải nghiệm tốt nhất.
        </p>
      </div>
    </div>
  );
}
