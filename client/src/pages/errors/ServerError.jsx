import { Link, useNavigate } from 'react-router-dom';

const ServerError = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-amber-50 px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full text-center">
                <div className="text-[120px] md:text-[180px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-red-500 to-amber-400 select-none">
                    500
                </div>
                <div className="text-5xl mb-4">ðŸ”§</div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                    MÃ¡y chá»§ Ä‘ang gáº·p sá»± cá»‘
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                    ChÃºng tÃ´i Ä‘ang gáº·p lá»—i táº¡m thá»i tá»« phÃ­a mÃ¡y chá»§. Äá»™i ká»¹ thuáº­t
                    cá»§a Trà Hoa Việt Ä‘Ã£ Ä‘Æ°á»£c thÃ´ng bÃ¡o vÃ  Ä‘ang kháº¯c phá»¥c. Báº¡n
                    vui lÃ²ng thá»­ láº¡i sau Ã­t phÃºt.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold shadow hover:opacity-95"
                    >
                        Thá»­ láº¡i
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                    >
                        â† Quay láº¡i
                    </button>
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                    >
                        Vá» trang chá»§
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServerError;

