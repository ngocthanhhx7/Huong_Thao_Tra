import { useEffect, useState } from 'react';

const NetworkError = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-100 px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full text-center">
                <div className="text-7xl md:text-8xl mb-6">📡</div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                    Mất kết nối mạng
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                    Có vẻ như thiết bị của bạn đang mất kết nối Internet. Vui lòng
                    kiểm tra lại đường truyền và thử lại.
                </p>

                <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold border mb-8 ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    {isOnline ? 'Đã có mạng trở lại' : 'Đang offline'}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        disabled={!isOnline}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={() => (window.location.href = '/')}
                        className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NetworkError;
