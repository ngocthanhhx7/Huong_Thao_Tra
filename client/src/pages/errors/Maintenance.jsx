const Maintenance = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 pt-24 pb-12">
            <div className="max-w-2xl w-full text-center">
                <div className="text-7xl md:text-8xl mb-6 animate-pulse">🛠️</div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                    Hệ thống đang bảo trì
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                    Trà Hoa Việt đang nâng cấp để mang đến trải nghiệm tốt hơn.
                    Vui lòng quay lại trong ít phút nữa. Cảm ơn bạn đã kiên nhẫn!
                </p>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Dự kiến trở lại sớm
                </div>

                <div className="mt-10 text-sm text-gray-500">
                    Cần hỗ trợ gấp? Email:{' '}
                    <a href="mailto:thanhnnhe186491@fpt.edu.vn" className="text-primary-600 font-semibold hover:underline">
                        thanhnnhe186491@fpt.edu.vn
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;

