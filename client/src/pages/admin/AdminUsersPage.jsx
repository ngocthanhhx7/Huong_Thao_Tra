import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const { data } = await api.get('/admin/users');
        setUsers(data || []);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (id, role) => {
        await api.patch(`/admin/users/${id}/role`, { role });
        fetchUsers();
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Quản lý người dùng</h2>
            <div className="space-y-4">
                {users.map((member) => (
                    <div key={member._id} className="rounded-3xl border border-gray-100 p-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="font-bold text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                        <select value={member.role} onChange={(e) => updateRole(member._id, e.target.value)} className="px-4 py-3 rounded-2xl border border-gray-200">
                            <option value="Customer">Customer</option>
                            <option value="Staff">Staff</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsersPage;
