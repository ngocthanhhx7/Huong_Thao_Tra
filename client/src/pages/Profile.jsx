import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        gender: user?.gender || 'Khác',
        preferences: user?.preferences?.join(', ') || '',
        avatar: user?.avatar || '',
        password: '',
    });
    const [updateMsg, setUpdateMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                gender: user.gender || 'Khác',
                preferences: user.preferences?.join(', ') || '',
                avatar: user.avatar || '',
                password: '',
            });
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setUpdateMsg('Kích thước ảnh quá lớn (tối đa 2MB)');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUpdateMsg('');
        try {
            const prefsArray = formData.preferences
                ? formData.preferences.split(',').map(p => p.trim()).filter(p => p !== '')
                : [];

            const payload = {
                ...formData,
                preferences: prefsArray
            };

            // Remove password if empty string to avoid accidental override
            if (!payload.password) delete payload.password;

            const { data } = await api.put('/auth/profile', payload);

            // Backend returns updated user info with token
            // Map backend response fields to local storage and state
            const updatedUserInfo = {
                ...user,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                gender: data.gender,
                preferences: data.preferences,
                token: data.token || user.token
            };

            setUser(updatedUserInfo);
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setUpdateMsg('Cập nhật thông tin thành công!');
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field

            setTimeout(() => setUpdateMsg(''), 5000);
        } catch (error) {
            setUpdateMsg(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
            console.error('Update profile error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Determine Avatar URL
    const getAvatarDisplay = () => {
        if (formData.avatar) return formData.avatar;

        // Dynamic DiceBear fallback
        if (formData.gender === 'Nam') return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4';
        if (formData.gender === 'Nữ') return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf';
        return `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=10b981`;
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
                    <div className="h-40 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute -bottom-16 left-8 sm:left-12 z-10">
                            <div className="relative group">
                                <img
                                    src={getAvatarDisplay()}
                                    alt="Profile"
                                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white object-cover bg-white shadow-xl transition-transform group-hover:scale-[1.02]"
                                />
                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-white backdrop-blur-sm">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-24 px-8 sm:px-12 pb-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
                                <p className="text-gray-500 font-medium text-lg mt-1">@{user.username}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span className={`px-5 py-2 rounded-full text-xs font-extrabold tracking-widest uppercase flex items-center gap-1.5 shadow-sm ${user.plan === 'Pro' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
                                    }`}>
                                    {user.plan === 'Pro' ? <><span className="text-sm">👑</span> PRO MEMBER</> : 'FREE ACCOUNT'}
                                </span>
                                {user.role === 'Admin' && (
                                    <span className="px-5 py-2 rounded-full text-xs font-extrabold tracking-widest uppercase bg-rose-50 text-rose-700 border border-rose-200 shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> ADMIN
                                    </span>
                                )}
                            </div>
                        </div>

                        {updateMsg && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 font-medium ${updateMsg.includes('thành công') ? 'bg-green-50/50 text-green-700 border border-green-100' : 'bg-red-50/50 text-red-700 border border-red-100'
                                }`}>
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {updateMsg.includes('thành công') 
                                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    }
                                </svg>
                                {updateMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-7">
                                <h3 className="text-sm font-extrabold text-gray-400 tracking-widest uppercase border-b border-gray-100 pb-3">Thông tin cá nhân</h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-medium disabled:bg-gray-50/80 disabled:text-gray-500 disabled:border-gray-100 outline-none"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-medium disabled:bg-gray-50/80 disabled:text-gray-500 disabled:border-gray-100 outline-none"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Giới tính</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-medium disabled:bg-gray-50/80 disabled:text-gray-500 disabled:border-gray-100 outline-none appearance-none"
                                        >
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác / Không tiết lộ</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-7">
                                <h3 className="text-sm font-extrabold text-gray-400 tracking-widest uppercase border-b border-gray-100 pb-3">Sở thích & Bảo mật</h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Sở thích hương vị trà</label>
                                        <textarea
                                            name="preferences"
                                            value={formData.preferences}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            rows="2"
                                            className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-medium disabled:bg-gray-50/80 disabled:text-gray-500 disabled:border-gray-100 outline-none resize-none"
                                            placeholder="VD: Trà xanh, Bạc hà, Ngọt diệu..."
                                        />
                                        <p className="text-xs text-gray-400 mt-2 font-medium">* Ngăn cách các sở thích bằng dấu phẩy</p>
                                    </div>

                                    {isEditing && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Đổi mật khẩu mới</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-medium outline-none"
                                                placeholder="Để trống nếu không muốn đổi"
                                            />
                                        </div>
                                    )}

                                    <div className="pt-6 flex gap-4">
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all duration-300"
                                            >
                                                Chỉnh Sửa Hồ Sơ
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="flex-1 bg-white text-gray-700 py-4 px-6 rounded-2xl font-bold border-2 border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all duration-300"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl shadow-primary-500/30 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex justify-center items-center"
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Đang lưu...
                                                        </span>
                                                    ) : 'Lưu Thay Đổi'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="mt-14 bg-gray-50/50 rounded-3xl p-8 sm:p-10 border border-gray-100/80 shadow-inner">
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                Trợ Lý AI Cá Nhân
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <a href="/ai-history" className="bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
                                    <p className="font-extrabold text-gray-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">Lịch sử AI</p>
                                    <p className="text-sm font-medium text-gray-500">Xem lại và quản lý các công thức, liệu trình đã tạo</p>
                                </a>
                                {user.plan !== 'Pro' && (
                                    <a href="/activate-pro" className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                                        <p className="relative z-10 font-extrabold text-amber-900 text-lg mb-1 group-hover:text-amber-700 transition-colors">Kích hoạt PRO 👑</p>
                                        <p className="relative z-10 text-sm font-medium text-amber-700/80">Mở khóa toàn bộ trải nghiệm trí tuệ nhân tạo cao cấp</p>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
