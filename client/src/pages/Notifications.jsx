import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);

    const fetchNotifications = async () => {
        const { data } = await api.get('/notifications');
        setItems(data || []);
    };

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    const markRead = async (id) => {
        await api.patch(`/notifications/${id}/read`);
        fetchNotifications();
    };

    const markAll = async () => {
        await api.patch('/notifications/read-all');
        fetchNotifications();
    };

    if (!user) return <div className="text-center py-24 text-gray-500">Vui lòng đăng nhập để xem thông báo.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Thông báo</h1>
                    <p className="text-gray-500 mt-2">Các cập nhật đơn hàng, thanh toán, bài viết và phản hồi.</p>
                </div>
                <button onClick={markAll} className="px-5 py-3 rounded-2xl bg-primary-50 text-primary-700 font-bold border border-primary-100">Đánh dấu đã đọc tất cả</button>
            </div>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item._id} className={`rounded-2xl border p-5 ${item.isRead ? 'bg-white border-gray-100' : 'bg-primary-50/50 border-primary-100'}`}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-extrabold text-gray-900">{item.title}</h2>
                                <p className="text-gray-600 mt-2">{item.message}</p>
                                {item.link && <a href={item.link} className="inline-block mt-3 text-primary-600 font-bold">Mở liên kết</a>}
                            </div>
                            {!item.isRead && <button onClick={() => markRead(item._id)} className="text-sm font-bold text-primary-600">Đã đọc</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
