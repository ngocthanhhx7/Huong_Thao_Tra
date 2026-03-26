const StatsSection = () => {
    const stats = [
        { label: 'Khách hàng hài lòng', value: '10,000+' },
        { label: 'Đơn hàng đã giao', value: '50,000+' },
        { label: 'Loại trà đa dạng', value: '200+' },
        { label: 'Liệu trình AI tạo', value: '25,000+' },
    ];

    return (
        <section className="bg-gray-900 py-20 px-4 relative overflow-hidden">
            {/* Dark background decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-widest text-primary-400 uppercase mb-3">Sự Thật Về Chúng Tôi</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white">Được tin dùng bởi hàng ngàn khách hàng</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-3">{stat.value}</div>
                            <div className="text-gray-400 font-medium text-sm md:text-base">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;