import { useContext, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import {
    AdminButton,
    AdminPageHeader,
    AdminPanel,
    EmptyState,
    ErrorState,
    FormField,
    LoadingState,
    MetricCard,
    StatusBadge,
} from '../../components/admin/AdminUi';
import {
    adminInputClass,
    adminSelectClass,
} from '../../components/admin/adminUtils';

const roleTones = {
    Admin: 'teal',
    Staff: 'green',
    Customer: 'slate',
};

const proTones = {
    purchase_bonus: 'green',
    monthly: 'blue',
    six_months: 'purple',
    admin_grant: 'teal',
};

const AdminUsersPage = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await api.get('/admin/users');
            setUsers(data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (id, role) => {
        try {
            setUpdatingId(id);
            await api.patch(`/admin/users/${id}/role`, { role });
            await fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể cập nhật quyền người dùng.');
        } finally {
            setUpdatingId('');
        }
    };

    const handleProAction = async (userId, action) => {
        const days = action === 'extend' ? prompt('Nhập số ngày gia hạn:', '30') : null;
        if (action === 'extend' && !days) return;
        try {
            await api.patch(`/wellness/admin/users/${userId}/pro`, {
                action,
                days: days ? parseInt(days) : undefined,
                note: `Admin ${action}`,
            });
            await fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi thao tác Pro');
        }
    };

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return users.filter((member) => {
            const matchesRole = roleFilter === 'all' || member.role === roleFilter;
            const matchesSearch =
                !keyword ||
                member.name?.toLowerCase().includes(keyword) ||
                member.email?.toLowerCase().includes(keyword);

            return matchesRole && matchesSearch;
        });
    }, [roleFilter, search, users]);

    const adminCount = users.filter((member) => member.role === 'Admin').length;
    const staffCount = users.filter((member) => member.role === 'Staff').length;
    const customerCount = users.filter((member) => member.role === 'Customer').length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Users"
                title="Quản lý người dùng"
                description="Phân quyền tài khoản giữa Customer, Staff và Admin. Tài khoản hiện tại được khóa để tránh tự hạ quyền ngoài ý muốn."
                meta={
                    <>
                        <StatusBadge tone="teal">{adminCount} Admin</StatusBadge>
                        <StatusBadge tone="green">{staffCount} Staff</StatusBadge>
                    </>
                }
            />

            {error && <ErrorState message={error} onRetry={fetchUsers} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard label="Tổng người dùng" value={users.length} caption="Tất cả role" tone="green" />
                <MetricCard label="Staff/Admin" value={adminCount + staffCount} caption="Có quyền vận hành" tone="teal" />
                <MetricCard label="Customer" value={customerCount} caption="Tài khoản mua hàng" tone="blue" />
            </div>

            <AdminPanel
                title="Danh sách tài khoản"
                description="Tìm theo tên hoặc email, lọc theo role để kiểm tra quyền nhanh."
                actions={
                    <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-[220px_160px]">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm người dùng" className={adminInputClass} />
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={adminSelectClass}>
                            <option value="all">Tất cả role</option>
                            <option value="Customer">Customer</option>
                            <option value="Staff">Staff</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                }
            >
                {loading ? (
                    <LoadingState rows={5} />
                ) : filteredUsers.length ? (
                    <div className="divide-y divide-slate-100">
                        {filteredUsers.map((member) => {
                            const isCurrentUser = member._id === user?._id;
                            const pro = member.pro || {};
                            const isPro = pro.isPro && pro.proExpiry && new Date(pro.proExpiry) > new Date();

                            return (
                                <div key={member._id} className="grid gap-4 py-4 first:pt-0 last:pb-0 md:grid-cols-[1fr_220px] md:items-end">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-black text-slate-950">{member.name}</p>
                                            <StatusBadge tone={roleTones[member.role] || 'slate'}>{member.role}</StatusBadge>
                                            {isCurrentUser && <StatusBadge tone="blue">Bạn</StatusBadge>}
                                            {isPro && (
                                                <StatusBadge tone={proTones[pro.proPlan] || 'green'}>
                                                    Pro {pro.proPlan === 'purchase_bonus' ? 'Tặng' : pro.proPlan === 'monthly' ? '1T' : pro.proPlan === 'six_months' ? '6T' : 'Admin'}
                                                </StatusBadge>
                                            )}
                                            {!isPro && pro.proExpiry && <StatusBadge tone="zinc">Hết hạn</StatusBadge>}
                                        </div>
                                        <p className="mt-1 break-all text-sm text-slate-600">{member.email}</p>
                                        {isPro && (
                                            <p className="text-xs text-slate-400">
                                                Hết hạn: {new Date(pro.proExpiry).toLocaleDateString('vi-VN')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <FormField label="Phân quyền">
                                            <select
                                                value={member.role}
                                                disabled={isCurrentUser || updatingId === member._id}
                                                onChange={(e) => updateRole(member._id, e.target.value)}
                                                className={adminSelectClass}
                                            >
                                                <option value="Customer">Customer</option>
                                                <option value="Staff">Staff</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </FormField>
                                        <div className="flex gap-1">
                                            {!isPro ? (
                                                <button
                                                    onClick={() => handleProAction(member._id, 'activate')}
                                                    className="flex-1 rounded border border-green-200 bg-green-50 px-2 py-1 text-xs font-bold text-green-700 hover:bg-green-100"
                                                >
                                                    + Pro
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleProAction(member._id, 'extend')}
                                                        className="flex-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100"
                                                    >
                                                        Gia hạn
                                                    </button>
                                                    <button
                                                        onClick={() => handleProAction(member._id, 'deactivate')}
                                                        className="flex-1 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-100"
                                                    >
                                                        Tắt
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        title="Không có người dùng phù hợp"
                        description="Thử đổi role hoặc từ khóa tìm kiếm."
                        action={<AdminButton variant="neutral" onClick={() => { setSearch(''); setRoleFilter('all'); }}>Xóa bộ lọc</AdminButton>}
                    />
                )}
            </AdminPanel>
        </div>
    );
};

export default AdminUsersPage;
