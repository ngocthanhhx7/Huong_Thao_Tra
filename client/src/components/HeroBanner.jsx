import { Link } from 'react-router-dom';

const HeroBanner = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-white py-24 px-4 sm:px-6 lg:px-8">
            {/* Decorative background blur elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-200/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-100 shadow-sm mb-8 animate-fade-in-up">
                    <span className="text-primary-600">✨</span>
                    <span className="text-sm font-semibold text-primary-800 tracking-wide uppercase">Công nghệ AI độc quyền</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                    Khám phá tương lai của <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-emerald-500">Trà Thảo Mộc</span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Trải nghiệm các liệu trình và công thức trà cá nhân hóa từ AI chuyên gia. Phân tích chi tiết dựa trên thể trạng sức khỏe, thói quen và sở thích của riêng bạn.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/ai-mix" className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary-500/30 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                        <span>🌿</span> Thử AI Pha Trà
                    </Link>
                    <Link to="/teas" className="w-full sm:w-auto bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:border-gray-200 hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center">
                        Khám phá cửa hàng
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;