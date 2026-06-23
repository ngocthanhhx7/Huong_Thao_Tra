import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/AuthContext';
import { useState } from 'react';

const tabs = [
  { to: '/wellness/dashboard', label: 'Sức khỏe', icon: '📊' },
  { to: '/wellness/journal', label: 'Nhật ký', icon: '📔' },
  { to: '/wellness/coach', label: 'AI Coach', icon: '🤖' },
];

const moreItems = [
  { to: '/wellness/suggest', label: 'Gợi ý đồ uống', icon: '🍵' },
  { to: '/wellness/workout', label: 'Vận động', icon: '🏃' },
  { to: '/wellness/challenges', label: 'Thử thách', icon: '🎯' },
  { to: '/wellness/reports', label: 'Báo cáo', icon: '📋' },
  { to: '/wellness/drug-check', label: 'Kiểm tra thuốc', icon: '💊' },
  { to: '/wellness/family', label: 'Gia đình', icon: '👨‍👩‍👧‍👦' },
  { to: '/wellness/pro', label: 'Gói Pro', icon: '⭐' },
  { to: '/wellness/settings', label: 'Cài đặt', icon: '⚙️' },
  { to: '/wellness/profile', label: 'Hồ sơ', icon: '👤' },
];

export default function WellnessLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/wellness/login');
  };

  return (
    <div className="flex flex-col h-full bg-leaf-50">
      <main className="flex-1 overflow-y-auto pb-20 safe-bottom">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 safe-bottom z-50">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[11px] font-medium">{tab.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-500"
        >
          <span className="text-xl">☰</span>
          <span className="text-[11px] font-medium">Thêm</span>
        </button>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 animate-slide-up max-h-[70vh] overflow-y-auto safe-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-leaf-50 hover:bg-leaf-100 transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs text-center font-medium text-gray-700">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
