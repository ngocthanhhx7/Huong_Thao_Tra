import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]' : 'bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)]'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <img src="/logo.png" alt="Hương Thảo Trà Logo" className="h-11 w-11 object-cover rounded-full shadow-sm ring-2 ring-primary-100 group-hover:ring-primary-300 transition-all duration-300" />
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 tracking-tight">Hương Thảo Trà</span>
                        </Link>
                        <div className="hidden md:ml-12 md:flex md:space-x-1 lg:space-x-2">
                            <Link to="/" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200">Trang chủ</Link>
                            <Link to="/teas" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200">Cửa hàng</Link>
                            <Link to="/ai-mix" className="text-primary-600 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-1.5"><span className="text-lg">🌿</span> Pha Trà AI</Link>
                            {user?.plan === 'Pro' && (
                                <Link to="/ai-plan" className="text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-1.5"><span className="text-lg">✨</span> Liệu Trình VIP</Link>
                            )}
                            <Link to="/about" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200">Giới thiệu</Link>
                            <Link to="/contact" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200">Liên hệ</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-4 rounded-full border border-transparent hover:border-gray-200 transition-all duration-200"
                                >
                                    <img
                                        src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=10b981`}
                                        alt="Avatar"
                                        className="w-9 h-9 rounded-full border border-gray-100 shadow-sm object-cover"
                                    />
                                    <div className="hidden md:flex flex-col items-start leading-tight">
                                        <span className="text-gray-800 font-bold text-sm">{user.name}</span>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                                            user.plan === 'Pro' ? 'text-purple-600' : 'text-primary-600'
                                        }`}>
                                            {user.plan || 'MEMBER'}
                                        </span>
                                    </div>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-10 border border-gray-100 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 mb-1">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">👤 Hồ sơ cá nhân</Link>
                                        <Link to="/cart" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">🛒 Giỏ hàng</Link>
                                        <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">📦 Đơn hàng</Link>
                                        <Link to="/ai-history" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">🧠 Lịch sử AI</Link>
                                        <Link to="/activate-pro" className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50 transition-colors">✨ Nâng cấp Pro</Link>
                                        <div className="h-px bg-gray-100 my-1"></div>
                                        <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">🚪 Đăng xuất</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-50 transition-all duration-200">Đăng nhập</Link>
                                <Link to="/register" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-primary-500/30 active:scale-95 transition-all duration-200">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
