import { Outlet } from 'react-router-dom';

function isIOSDevice() {
  if (typeof navigator === 'undefined') return false;

  const userAgent = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isiPhoneOrClassicIPad = /iPad|iPhone|iPod/.test(userAgent);
  const isiPadDesktopMode = platform === 'MacIntel' && maxTouchPoints > 1;

  return isiPhoneOrClassicIPad || isiPadDesktopMode;
}

function isStandalone() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const isDisplayModeStandalone =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;

  return isDisplayModeStandalone || window.navigator.standalone === true;
}

export default function PwaGate() {
  if (!isIOSDevice() || isStandalone()) {
    return <Outlet />;
  }

  return (
    <div className="pwa-install-page bg-gradient-to-b from-leaf-50 to-cream px-6">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        <img
          src="/wellness/logo.png"
          alt="Trà Hoa Việt"
          className="w-20 h-20 rounded-2xl object-cover ring-1 ring-primary-100 shadow-md mb-4"
        />

        <h1 className="text-2xl font-extrabold text-secondary text-center leading-tight mb-1">
          Cài đặt Trà Hoa Việt Wellness
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Trên iPhone và iPad, hãy thêm ứng dụng vào Màn hình chính để sử dụng.
        </p>

        <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-primary-600 mb-5 text-center">
            Cài đặt giống GeForce Now
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-leaf-50 flex items-center justify-center text-lg shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Mở bằng Safari</p>
                <p className="text-sm text-gray-600">
                  Nếu đang ở trình duyệt khác, hãy mở đường dẫn này trong Safari.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-leaf-50 flex items-center justify-center text-lg shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Nhấn nút Chia sẻ</p>
                <p className="text-sm text-gray-600">
                  Dùng biểu tượng Chia sẻ trên thanh công cụ Safari.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-leaf-50 flex items-center justify-center text-lg shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Thêm vào Màn hình chính</p>
                <p className="text-sm text-gray-600">
                  Chọn <span className="font-medium text-primary-600">Thêm vào Màn hình chính</span>, sau đó nhấn <span className="font-medium">Thêm</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="w-full h-40 rounded-xl bg-gradient-to-b from-white to-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
              ↑
            </div>
            <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-200" />
              <div className="w-8 h-8 rounded-lg bg-gray-200" />
              <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center text-lg">
                +
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-200" />
            </div>
            <p className="text-xs text-gray-400 mt-10">Safari → Chia sẻ → Thêm vào Màn hình chính</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Sau khi cài đặt, mở Trà Hoa Việt Wellness từ biểu tượng trên Màn hình chính.
        </p>
      </div>
    </div>
  );
}
