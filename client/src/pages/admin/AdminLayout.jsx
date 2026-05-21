import { useContext } from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const adminLinks = [
    { to: '/admin', label: 'Tổng quan', roles: ['Admin', 'Staff'] },
    { to: '/admin/orders', label: 'Đơn hàng', roles: ['Admin', 'Staff'] },
    { to: '/admin/ai-recipes', label: 'AI recipes', roles: ['Admin', 'Staff'] },
    { to: '/admin/posts', label: 'Bài viết', roles: ['Admin', 'Staff'] },
    { to: '/admin/feedback', label: 'Feedback', roles: ['Admin', 'Staff'] },
    { to: '/admin/analytics', label: 'Phân tích bán hàng', roles: ['Admin', 'Staff'] },
    { to: '/admin/teas', label: 'Sản phẩm trà', roles: ['Admin'] },
    { to: '/admin/ingredients', label: 'Nguyên liệu', roles: ['Admin'] },
    { to: '/admin/users', label: 'Người dùng', roles: ['Admin'] },
];

const AdminLayout = () => {
    const { user } = useContext(AuthContext);

    if (!(user?.role === 'Admin' || user?.role === 'Staff')) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-8">
                <aside className="bg-white rounded-[32px] border border-gray-100 p-5 h-fit sticky top-28">
                    <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary-600 mb-3">Admin Studio</p>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Quản trị Hương Thảo Trà</h1>
                    <nav className="space-y-2">
                        {adminLinks
                            .filter((item) => item.roles.includes(user.role))
                            .map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === '/admin'}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                                            isActive
                                                ? 'bg-primary-600 text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-primary-700'
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                    </nav>
                </aside>

                <section className="min-w-0">
                    <Outlet />
                </section>
            </div>
        </div>
    );
};

export default AdminLayout;
