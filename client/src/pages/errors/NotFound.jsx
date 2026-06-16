import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-primary-50 px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full text-center">
                <div className="relative mx-auto mb-8 w-fit">
                    <div className="text-[120px] md:text-[180px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-emerald-400 select-none">
                        404
                    </div>
                    <div className="absolute -top-4 -right-6 text-5xl md:text-6xl animate-bounce">🍵</div>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                    Ôi! Trang bạn tìm không tồn tại
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                    Có thể đường dẫn đã thay đổi, đã bị xoá, hoặc bạn nhập sai địa
                    chỉ. Hãy thử quay lại hoặc khám phá những loại trà khác của
                    Trà Hoa Việt nhé.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                    >
                        ← Quay lại
                    </button>
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow hover:opacity-95 transition"
                    >
                        Về trang chủ
                    </Link>
                    <Link
                        to="/teas"
                        className="px-6 py-3 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100 transition"
                    >
                        Khám phá cửa hàng
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <Link to="/ai-mix" className="px-4 py-3 rounded-2xl bg-white border border-gray-100 text-gray-700 font-semibold hover:border-primary-300 hover:text-primary-700">
                        ✧ Pha Trà AI
                    </Link>
                    <Link to="/posts" className="px-4 py-3 rounded-2xl bg-white border border-gray-100 text-gray-700 font-semibold hover:border-primary-300 hover:text-primary-700">
                        Bảng tin
                    </Link>
                    <Link to="/about" className="px-4 py-3 rounded-2xl bg-white border border-gray-100 text-gray-700 font-semibold hover:border-primary-300 hover:text-primary-700">
                        Giới thiệu
                    </Link>
                    <Link to="/contact" className="px-4 py-3 rounded-2xl bg-white border border-gray-100 text-gray-700 font-semibold hover:border-primary-300 hover:text-primary-700">
                        Liên hệ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

