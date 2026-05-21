import { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const mainLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/teas', label: 'Cửa hàng' },
    { to: '/posts', label: 'Bảng tin' },
];

const exploreLinks = [
    { to: '/about', label: 'Giới thiệu' },
    { to: '/contact', label: 'Liên hệ' },
    { to: '/feedback', label: 'Feedback' },
];

const DropdownPanel = ({ children, align = 'right' }) => (
    <div className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} pt-3`}>
        <div className="min-w-[240px] rounded-[28px] border border-gray-100 bg-white shadow-[0_20px_50px_-18px_rgba(15,23,42,0.18)] p-3">
            {children}
        </div>
    </div>
);

DropdownPanel.propTypes = {
    children: PropTypes.node.isRequired,
    align: PropTypes.oneOf(['left', 'right']),
};

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
    const [isMobileUserOpen, setIsMobileUserOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) {
                setUnreadCount(0);
                return;
            }

            try {
                const { data } = await api.get('/notifications');
                setUnreadCount((data || []).filter((item) => !item.isRead).length);
            } catch {
                setUnreadCount(0);
            }
        };

        fetchNotifications();
    }, [user]);

    const userGroups = useMemo(() => ([
        {
            title: 'Tài khoản',
            items: [
                { to: '/profile', label: 'Hồ sơ cá nhân' },
            ],
        },
        {
            title: 'Mua sắm',
            items: [
                { to: '/cart', label: 'Giỏ hàng' },
                { to: '/orders', label: 'Đơn hàng' },
                { to: '/feedback', label: 'Feedback' },
            ],
        },
        {
            title: 'AI & trải nghiệm',
            items: [
                { to: '/ai-history', label: 'Lịch sử AI' },
                { to: '/activate-pro', label: 'Nâng cấp Pro', accent: 'text-purple-600' },
                ...(user?.plan === 'Pro' ? [{ to: '/ai-plan', label: 'Liệu trình VIP', accent: 'text-purple-600' }] : []),
            ],
        },
        ...(user?.role === 'Admin' || user?.role === 'Staff'
            ? [{
                title: 'Quản trị',
                items: [
                    { to: '/admin', label: 'Tổng quan admin', accent: 'text-amber-700' },
                    { to: '/admin/orders', label: 'Đơn hàng', accent: 'text-amber-700' },
                    { to: '/admin/analytics', label: 'Phân tích bán hàng', accent: 'text-amber-700' },
                ],
            }]
            : []),
    ]), [user?.plan, user?.role]);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const closeAllMenus = () => {
        setActiveDropdown('');
        setIsMobileMenuOpen(false);
        setIsMobileExploreOpen(false);
        setIsMobileUserOpen(false);
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/92 backdrop-blur-xl shadow-[0_10px_35px_-18px_rgba(15,23,42,0.25)]' : 'bg-white shadow-[0_1px_6px_rgba(15,23,42,0.08)]'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeAllMenus}>
                        <img src="/logo.png" alt="Hương Thảo Trà Logo" className="h-11 w-11 object-cover rounded-full ring-2 ring-primary-100" />
                        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 tracking-tight">
                            Hương Thảo Trà
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center justify-center gap-2 flex-1">
                        {mainLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `px-4 py-2.5 rounded-full text-sm font-semibold transition ${
                                        isActive
                                            ? 'text-gray-900'
                                            : 'text-gray-700 hover:text-primary-700'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <NavLink
                            to="/ai-mix"
                            className={({ isActive }) =>
                                `ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition ${
                                    isActive
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`
                            }
                        >
                            <span className="text-base">✧</span>
                            <span>Pha Trà AI</span>
                        </NavLink>

                        <NavLink
                            to={user?.plan === 'Pro' ? '/ai-plan' : '/activate-pro'}
                            className={({ isActive }) =>
                                `inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold transition ${
                                    isActive
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                }`
                            }
                        >
                            Liệu Trình VIP
                        </NavLink>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('explore')}
                            onMouseLeave={() => setActiveDropdown('')}
                        >
                            <button className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition ${activeDropdown === 'explore' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                                <span>Thêm</span>
                                <svg className={`w-4 h-4 transition ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeDropdown === 'explore' && (
                                <DropdownPanel align="right">
                                    <div className="space-y-1">
                                        {exploreLinks.map((item) => (
                                            <Link key={item.to} to={item.to} onClick={closeAllMenus} className="block px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </DropdownPanel>
                            )}
                        </div>

                        {user && (
                            <Link
                                to="/notifications"
                                className="relative w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm shrink-0"
                                aria-label="Thông báo"
                            >
                                <span className="text-lg">🔔</span>
                                {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
                            </Link>
                        )}

                        {user ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('user')}
                                onMouseLeave={() => setActiveDropdown('')}
                            >
                                <button className={`flex items-center gap-3 p-1.5 pr-5 rounded-full border shadow-sm transition ${activeDropdown === 'user' ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-lg border border-purple-200">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <span>👤</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="text-sm font-bold text-gray-900">{user.name}</span>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-[0.25em] ${user.plan === 'Pro' ? 'text-purple-600' : 'text-primary-600'}`}>{user.plan}</span>
                                    </div>
                                </button>
                                {activeDropdown === 'user' && (
                                    <DropdownPanel align="right">
                                        <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <div className="space-y-3">
                                            {userGroups.map((group) => (
                                                <div key={group.title}>
                                                    <p className="px-4 pb-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-400">{group.title}</p>
                                                    {group.items.map((item) => (
                                                        <Link key={item.to} to={item.to} onClick={closeAllMenus} className={`block px-4 py-2.5 rounded-2xl text-sm font-semibold hover:bg-gray-50 ${item.accent || 'text-gray-700'}`}>
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-px bg-gray-100 my-2" />
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50">
                                            Đăng xuất
                                        </button>
                                    </DropdownPanel>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-700 hover:text-primary-700 px-4 py-2.5 rounded-full text-sm font-bold hover:bg-primary-50">Đăng nhập</Link>
                                <Link to="/register" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm">Đăng ký</Link>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsMobileMenuOpen((prev) => !prev)} className="md:hidden w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center bg-white">
                        <span className="text-xl">☰</span>
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden pb-5">
                        <div className="rounded-[28px] border border-gray-100 bg-white shadow-sm p-4 space-y-3">
                            {mainLinks.map((item) => (
                                <NavLink key={item.to} to={item.to} onClick={closeAllMenus} className={({ isActive }) => `block px-4 py-3 rounded-2xl text-sm font-semibold ${isActive || item.highlighted ? 'bg-primary-50 text-primary-700' : 'text-gray-700 bg-gray-50'}`}>
                                    {item.label}
                                </NavLink>
                            ))}

                            <NavLink to="/ai-mix" onClick={closeAllMenus} className="block px-4 py-3 rounded-2xl text-sm font-bold bg-emerald-50 text-emerald-700">
                                ✧ Pha Trà AI
                            </NavLink>
                            <NavLink to={user?.plan === 'Pro' ? '/ai-plan' : '/activate-pro'} onClick={closeAllMenus} className="block px-4 py-3 rounded-2xl text-sm font-bold bg-purple-50 text-purple-700">
                                Liệu Trình VIP
                            </NavLink>

                            <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                <button onClick={() => setIsMobileExploreOpen((prev) => !prev)} className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-50">
                                    Thêm
                                </button>
                                {isMobileExploreOpen && (
                                    <div className="p-2 space-y-2 bg-white">
                                        {exploreLinks.map((item) => (
                                            <Link key={item.to} to={item.to} onClick={closeAllMenus} className="block px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {user ? (
                                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                    <button onClick={() => setIsMobileUserOpen((prev) => !prev)} className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 bg-gray-50">
                                        {user.name}
                                    </button>
                                    {isMobileUserOpen && (
                                        <div className="p-2 space-y-2 bg-white">
                                            <Link to="/notifications" onClick={closeAllMenus} className="block px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 bg-gray-50">
                                                Thông báo {unreadCount > 0 ? '• Mới' : ''}
                                            </Link>
                                            {userGroups.flatMap((group) => group.items).map((item) => (
                                                <Link key={item.to} to={item.to} onClick={closeAllMenus} className={`block px-4 py-3 rounded-2xl text-sm font-semibold bg-gray-50 ${item.accent || 'text-gray-700'}`}>
                                                    {item.label}
                                                </Link>
                                            ))}
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 bg-red-50">
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/login" onClick={closeAllMenus} className="text-center px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 bg-gray-50">Đăng nhập</Link>
                                    <Link to="/register" onClick={closeAllMenus} className="text-center px-4 py-3 rounded-2xl text-sm font-bold text-white bg-primary-600">Đăng ký</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
