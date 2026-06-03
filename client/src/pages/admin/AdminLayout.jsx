import { useContext } from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { StatusBadge } from '../../components/admin/AdminUi';

const adminLinks = [
    { to: '/admin', label: 'Tá»•ng quan', hint: 'Sá»‘ liá»‡u vÃ  viá»‡c cáº§n lÃ m', marker: 'OV', roles: ['Admin', 'Staff'] },
    { to: '/admin/orders', label: 'ÄÆ¡n hÃ ng', hint: 'Xá»­ lÃ½ tráº¡ng thÃ¡i giao hÃ ng', marker: 'OR', roles: ['Admin', 'Staff'] },
    { to: '/admin/ai-recipes', label: 'Duyá»‡t AI', hint: 'CÃ´ng thá»©c khÃ¡ch gá»­i bÃ¡n', marker: 'AI', roles: ['Admin', 'Staff'] },
    { to: '/admin/posts', label: 'BÃ i viáº¿t', hint: 'Táº¡o, sá»­a, xuáº¥t báº£n ná»™i dung', marker: 'PO', roles: ['Admin', 'Staff'] },
    { to: '/admin/feedback', label: 'Feedback', hint: 'Pháº£n há»“i khÃ¡ch hÃ ng', marker: 'FB', roles: ['Admin', 'Staff'] },
    { to: '/admin/analytics', label: 'PhÃ¢n tÃ­ch', hint: 'Doanh thu vÃ  tá»“n kho', marker: 'AN', roles: ['Admin', 'Staff'] },
    { to: '/admin/teas', label: 'Sáº£n pháº©m trÃ ', hint: 'GiÃ¡, tá»“n kho, hiá»ƒn thá»‹', marker: 'TE', roles: ['Admin'] },
    { to: '/admin/ingredients', label: 'NguyÃªn liá»‡u', hint: 'GiÃ¡ vÃ  mÃ´ táº£ nguyÃªn liá»‡u', marker: 'IN', roles: ['Admin'] },
    { to: '/admin/users', label: 'NgÆ°á»i dÃ¹ng', hint: 'PhÃ¢n quyá»n tÃ i khoáº£n', marker: 'US', roles: ['Admin'] },
];

const AdminLayout = () => {
    const { user } = useContext(AuthContext);

    if (!(user?.role === 'Admin' || user?.role === 'Staff')) {
        return <Navigate to="/" replace />;
    }

    const visibleLinks = adminLinks.filter((item) => item.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-[#F4F7F1] px-4 pb-12 pt-24 md:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[288px_1fr]">
                <aside className="admin-panel h-fit xl:sticky xl:top-24">
                    <div className="mb-5 flex items-start justify-between gap-3">
                        <div>
                            <p className="admin-eyebrow">Admin Studio</p>
                            <h1 className="text-xl font-black leading-tight text-slate-950">Trà Hoa Việt</h1>
                            <p className="mt-1 text-sm text-slate-600">{user.name || user.email}</p>
                        </div>
                        <StatusBadge tone={user.role === 'Admin' ? 'purple' : 'green'}>{user.role}</StatusBadge>
                    </div>

                    <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                        {visibleLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/admin'}
                                className={({ isActive }) =>
                                    `group flex min-h-[64px] items-center gap-3 rounded-lg border px-3 py-2 transition ${
                                        isActive
                                            ? 'border-[#58CC02] bg-[#EAF9DE] text-slate-950 shadow-[0_3px_0_#58CC02]'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-[#A9E878] hover:bg-[#F7FBF4]'
                                    }`
                                }
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-black text-slate-700">
                                    {item.marker}
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-sm font-black">{item.label}</span>
                                    <span className="block truncate text-xs text-slate-500">{item.hint}</span>
                                </span>
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

