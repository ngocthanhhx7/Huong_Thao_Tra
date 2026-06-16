import { Link, useNavigate } from 'react-router-dom';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full text-center">
                <div className="text-[120px] md:text-[180px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-teal-400 select-none">
                    403
                </div>
                <div className="text-5xl mb-4">🔒</div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                    Bạn không có quyền truy cập
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                    Trang này chỉ dành cho thành viên đã được cấp quyền. Nếu bạn
                    nghĩ đây là nhầm lẫn, hãy liên hệ quản trị viên hoặc đăng nhập
                    bằng tài khoản phù hợp.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                    >
                        ← Quay lại
                    </button>
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow hover:opacity-95"
                    >
                        Về trang chủ
                    </Link>
                    <Link
                        to="/login"
                        className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                    >
                        Đăng nhập tài khoản khác
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;
