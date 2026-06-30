import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/AuthContext';
import { useState } from 'react';
import SkillIcon from './SkillIcon';

const tabs = [
  { to: '/dashboard', label: 'Sức khỏe', icon: '📊', skillIcon: 'health' },
  { to: '/journal', label: 'Nhật ký', icon: '📔', skillIcon: 'journal' },
  { to: '/coach', label: 'AI Coach', icon: '🤖', skillIcon: 'coach' },
];

const moreItems = [
  { to: '/suggest', label: 'Gợi ý đồ uống', icon: '🍵', skillIcon: 'suggest' },
  { to: '/workout', label: 'Vận động', icon: '🏃', skillIcon: 'workout' },
  { to: '/challenges', label: 'Thử thách', icon: '🎯', skillIcon: 'challenges' },
  { to: '/reports', label: 'Báo cáo', icon: '📋', skillIcon: 'reports' },
  { to: '/drug-check', label: 'Kiểm tra thuốc', icon: '💊', skillIcon: 'drug-check' },
  { to: '/family', label: 'Gia đình', icon: '👨‍👩‍👧‍👦', skillIcon: 'family' },
  { to: '/pro', label: 'Gói Pro', icon: '⭐', skillIcon: 'pro' },
  { to: '/settings', label: 'Cài đặt', icon: '⚙️', skillIcon: 'settings' },
  { to: '/profile', label: 'Hồ sơ', icon: '👤', skillIcon: 'profile' },
];

export default function WellnessLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="wellness-app-shell flex flex-col bg-leaf-50">
      <main className="wellness-app-main">
        <Outlet />
      </main>

      <nav className="wellness-bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around z-50">
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
            <SkillIcon icon={tab.skillIcon} fallback={tab.icon} className="w-6 h-6" />
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
          <div className="wellness-drawer-panel absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 animate-slide-up max-h-[70vh] overflow-y-auto">
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
                  <SkillIcon icon={item.skillIcon} fallback={item.icon} className="w-8 h-8" />
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
