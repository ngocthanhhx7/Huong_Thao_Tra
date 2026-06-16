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
    { to: '/ingredients', label: 'Trà liệu' },
    { to: '/about', label: 'Giới thiệu' },
    { to: '/contact', label: 'Liên hệ' },
    { to: '/feedback', label: 'Feedback' },
];

const Icon = ({ children, className = 'h-5 w-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {children}
    </svg>
);

Icon.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

const DropdownPanel = ({ children, align = 'right' }) => (
    <div className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} pt-3`}>
        <div className="min-w-[240px] rounded-xl border border-leaf-100 bg-white p-2 shadow-[0_18px_40px_rgba(39,67,42,0.12)]">
            {children}
        </div>
    </div>
);

DropdownPanel.propTypes = {
    children: PropTypes.node.isRequired,
    align: PropTypes.oneOf(['left', 'right']),
};

const linkClass = ({ isActive }) =>
    `wellness-focus inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-bold transition ${
        isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-leaf-50 hover:text-primary-700'
    }`;

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
    const [isMobileUserOpen, setIsMobileUserOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
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

    useEffect(() => {
        const fetchCartCount = async () => {
            if (!user) {
                setCartCount(0);
                return;
            }

            try {
                const { data } = await api.get('/cart');
                const count = (data?.items || []).reduce((total, item) => total + (Number(item.qty) || 0), 0);
                setCartCount(count);
            } catch {
                setCartCount(0);
            }
        };

        fetchCartCount();

        const handleCartUpdated = () => fetchCartCount();
        window.addEventListener('cart:updated', handleCartUpdated);
        window.addEventListener('focus', handleCartUpdated);

        return () => {
            window.removeEventListener('cart:updated', handleCartUpdated);
            window.removeEventListener('focus', handleCartUpdated);
        };
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
                { to: '/orders', label: 'Đơn hàng' },
                { to: '/feedback', label: 'Feedback' },
            ],
        },
        {
            title: 'AI & trải nghiệm',
            items: [
                { to: '/ai-history', label: 'Lịch sử AI' },
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
    ]), [user?.role]);

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
        <nav className={`fixed top-0 z-50 w-full border-b border-leaf-100 transition ${isScrolled ? 'bg-white/95 shadow-[0_8px_26px_rgba(39,67,42,0.08)] backdrop-blur' : 'bg-white'}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between gap-4">
                    <Link to="/" className="wellness-focus flex min-w-0 shrink-0 items-center gap-3 rounded-lg" onClick={closeAllMenus}>
                        <img src="/logo.png" alt="Trà Hoa Việt" className="h-11 w-11 rounded-lg object-cover ring-1 ring-primary-100" />
                        <span className="hidden text-xl font-black text-leaf-800 sm:block lg:text-2xl">Trà Hoa Việt</span>
                    </Link>

                    <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
                        {mainLinks.map((item) => (
                            <NavLink key={item.to} to={item.to} className={linkClass}>
                                {item.label}
                            </NavLink>
                        ))}

                        <NavLink
                            to="/ai-mix"
                            className={({ isActive }) =>
                                `wellness-focus ml-2 inline-flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold transition ${
                                    isActive ? 'bg-primary-700 text-white' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                }`
                            }
                        >
                            <Icon className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M6 7c4 0 6 2 6 6-4 0-6-2-6-6ZM18 7c-4 0-6 2-6 6 4 0 6-2 6-6Z" />
                            </Icon>
                            Pha Trà AI
                        </NavLink>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('explore')}
                            onMouseLeave={() => setActiveDropdown('')}
                        >
                            <button type="button" className="wellness-focus inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-leaf-50 hover:text-primary-700">
                                Tìm hiểu thêm
                                <Icon className={`h-4 w-4 transition ${activeDropdown === 'explore' ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                                </Icon>
                            </button>
                            {activeDropdown === 'explore' && (
                                <DropdownPanel align="right">
                                    <div className="space-y-1">
                                        {exploreLinks.map((item) => (
                                            <Link key={item.to} to={item.to} onClick={closeAllMenus} className="wellness-focus block rounded-lg px-4 py-3 text-sm font-bold text-gray-700 hover:bg-leaf-50 hover:text-primary-700">
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </DropdownPanel>
                            )}
                        </div>

                        {user && (
                            <>
                                <Link
                                    to="/cart"
                                    className="wellness-focus relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-leaf-100 bg-white text-leaf-800 transition hover:bg-leaf-50"
                                    aria-label="Giỏ hàng"
                                    title="Giỏ hàng"
                                >
                                    <Icon>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.6L5 3H2" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20h.01M18 20h.01" />
                                    </Icon>
                                    {cartCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[10px] font-black text-white ring-2 ring-white">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    to="/notifications"
                                    className="wellness-focus relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-leaf-100 bg-white text-leaf-800 transition hover:bg-leaf-50"
                                    aria-label="Thông báo"
                                    title="Thông báo"
                                >
                                    <Icon>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5M10 20h4" />
                                    </Icon>
                                    {unreadCount > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
                                </Link>
                            </>
                        )}

                        {user ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('user')}
                                onMouseLeave={() => setActiveDropdown('')}
                            >
                                <button type="button" className="wellness-focus flex min-h-11 items-center gap-3 rounded-lg border border-leaf-100 bg-white p-1.5 pr-4 transition hover:bg-leaf-50">
                                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary-50 text-primary-700">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <Icon className="h-5 w-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 1 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                                            </Icon>
                                        )}
                                    </div>
                                    <div className="flex min-w-0 flex-col items-start leading-tight">
                                        <span className="max-w-[120px] truncate text-sm font-extrabold text-leaf-800">{user.name}</span>
                                        <span className="text-[11px] font-black uppercase text-primary-700">{user.role || 'Customer'}</span>
                                    </div>
                                </button>
                                {activeDropdown === 'user' && (
                                    <DropdownPanel align="right">
                                        <div className="mb-2 border-b border-leaf-100 px-4 py-3">
                                            <p className="truncate text-sm font-extrabold text-leaf-800">{user.name}</p>
                                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <div className="space-y-3">
                                            {userGroups.map((group) => (
                                                <div key={group.title}>
                                                    <p className="px-4 pb-1 text-[11px] font-black uppercase text-gray-400">{group.title}</p>
                                                    {group.items.map((item) => (
                                                        <Link key={item.to} to={item.to} onClick={closeAllMenus} className={`wellness-focus block rounded-lg px-4 py-2.5 text-sm font-bold hover:bg-leaf-50 ${item.accent || 'text-gray-700'}`}>
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="my-2 h-px bg-leaf-100" />
                                        <button type="button" onClick={handleLogout} className="wellness-focus w-full rounded-lg px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50">
                                            Đăng xuất
                                        </button>
                                    </DropdownPanel>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="wellness-focus rounded-lg px-4 py-2.5 text-sm font-extrabold text-gray-700 hover:bg-leaf-50 hover:text-primary-700">Đăng nhập</Link>
                                <Link to="/register" className="wellness-focus rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-primary-600">Đăng ký</Link>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="wellness-focus flex h-11 w-11 items-center justify-center rounded-lg border border-leaf-100 bg-white text-leaf-800 md:hidden"
                        aria-label="Mở menu"
                    >
                        <Icon>
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                            )}
                        </Icon>
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div className="pb-5 md:hidden">
                        <div className="space-y-3 rounded-xl border border-leaf-100 bg-white p-3 shadow-sm">
                            {mainLinks.map((item) => (
                                <NavLink key={item.to} to={item.to} onClick={closeAllMenus} className={({ isActive }) => `wellness-focus block rounded-lg px-4 py-3 text-sm font-bold ${isActive ? 'bg-primary-50 text-primary-700' : 'bg-leaf-50 text-gray-700'}`}>
                                    {item.label}
                                </NavLink>
                            ))}

                            <NavLink to="/ai-mix" onClick={closeAllMenus} className="wellness-focus block rounded-lg bg-primary-50 px-4 py-3 text-sm font-extrabold text-primary-700">
                                Pha Trà AI
                            </NavLink>

                            <div className="overflow-hidden rounded-lg border border-leaf-100">
                                <button type="button" onClick={() => setIsMobileExploreOpen((prev) => !prev)} className="wellness-focus flex w-full items-center justify-between bg-leaf-50 px-4 py-3 text-left text-sm font-bold text-gray-700">
                                    Tìm hiểu thêm
                                    <Icon className={`h-4 w-4 transition ${isMobileExploreOpen ? 'rotate-180' : ''}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                                    </Icon>
                                </button>
                                {isMobileExploreOpen && (
                                    <div className="space-y-2 bg-white p-2">
                                        {exploreLinks.map((item) => (
                                            <Link key={item.to} to={item.to} onClick={closeAllMenus} className="wellness-focus block rounded-lg px-4 py-3 text-sm font-bold text-gray-700 hover:bg-leaf-50">
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {user ? (
                                <div className="overflow-hidden rounded-lg border border-leaf-100">
                                    <button type="button" onClick={() => setIsMobileUserOpen((prev) => !prev)} className="wellness-focus flex w-full items-center justify-between bg-leaf-50 px-4 py-3 text-left text-sm font-bold text-gray-700">
                                        {user.name}
                                        <Icon className={`h-4 w-4 transition ${isMobileUserOpen ? 'rotate-180' : ''}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                                        </Icon>
                                    </button>
                                    {isMobileUserOpen && (
                                        <div className="space-y-2 bg-white p-2">
                                            <Link to="/cart" onClick={closeAllMenus} className="wellness-focus flex items-center justify-between rounded-lg bg-leaf-50 px-4 py-3 text-sm font-bold text-gray-700">
                                                <span>Giỏ hàng</span>
                                                {cartCount > 0 && <span className="rounded-full bg-primary-700 px-2 py-0.5 text-xs font-black text-white">{cartCount > 99 ? '99+' : cartCount}</span>}
                                            </Link>
                                            <Link to="/notifications" onClick={closeAllMenus} className="wellness-focus block rounded-lg bg-leaf-50 px-4 py-3 text-sm font-bold text-gray-700">
                                                Thông báo {unreadCount > 0 ? 'mới' : ''}
                                            </Link>
                                            {userGroups.flatMap((group) => group.items).map((item) => (
                                                <Link key={item.to} to={item.to} onClick={closeAllMenus} className={`wellness-focus block rounded-lg bg-leaf-50 px-4 py-3 text-sm font-bold ${item.accent || 'text-gray-700'}`}>
                                                    {item.label}
                                                </Link>
                                            ))}
                                            <button type="button" onClick={handleLogout} className="wellness-focus w-full rounded-lg bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-600">
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/login" onClick={closeAllMenus} className="wellness-focus rounded-lg bg-leaf-50 px-4 py-3 text-center text-sm font-extrabold text-gray-700">Đăng nhập</Link>
                                    <Link to="/register" onClick={closeAllMenus} className="wellness-focus rounded-lg bg-primary-700 px-4 py-3 text-center text-sm font-extrabold text-white">Đăng ký</Link>
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

