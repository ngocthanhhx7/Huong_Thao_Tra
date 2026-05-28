import { Link, useLocation, useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full text-center">
                <div className="text-[120px] md:text-[180px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-amber-500 to-yellow-400 select-none">
                    401
                </div>
                <div className="text-5xl mb-4">🔐</div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                    Bạn cần đăng nhập để tiếp tục
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                    Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng
                    đăng nhập lại để truy cập tính năng này.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/login"
                        state={{ from }}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow hover:opacity-95"
                    >
                        Đăng nhập
                    </Link>
                    <Link
                        to="/register"
                        className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                    >
                        Tạo tài khoản
                    </Link>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
