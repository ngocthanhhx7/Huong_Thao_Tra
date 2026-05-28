import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');

        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Các đường dẫn không nên auto-redirect (tránh vòng lặp)
const ERROR_ROUTES = ['/login', '/register', '/404', '/403', '/401', '/500', '/maintenance', '/network-error'];

const isOnErrorRoute = () => ERROR_ROUTES.some((path) => window.location.pathname === path);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        // Mất kết nối / không có response từ server
        if (!error.response) {
            // Chỉ chuyển hướng nếu chắc chắn offline, tránh ảnh hưởng các fetch ngầm
            if (typeof navigator !== 'undefined' && navigator.onLine === false && !isOnErrorRoute()) {
                window.location.href = '/network-error';
            }
            return Promise.reject(error);
        }

        if (status === 401) {
            localStorage.removeItem('userInfo');

            if (window.location.pathname !== '/login' && !isOnErrorRoute()) {
                window.location.href = '/login';
            }
        }

        // Lưu ý: 403 và 500 KHÔNG tự redirect ở đây để các trang gọi API
        // có thể tự xử lý hiển thị lỗi cục bộ. Component có thể tự navigate
        // sang '/403' hoặc '/500' nếu thấy phù hợp.

        return Promise.reject(error);
    }
);

export default api;
