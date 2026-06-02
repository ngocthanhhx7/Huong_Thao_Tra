const StatsSection = () => {
    const stats = [
        { label: 'Khách hàng hài lòng', value: '10,000+' },
        { label: 'Đơn hàng đã giao', value: '50,000+' },
        { label: 'Loại trà đa dạng', value: '200+' },
        { label: 'Công thức AI đã tạo', value: '25,000+' },
    ];

    return (
        <section className="bg-leaf-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 text-center">
                    <p className="mb-3 text-sm font-extrabold uppercase text-primary-700">Dấu ấn của chúng tôi</p>
                    <h2 className="text-3xl font-black text-leaf-800 md:text-4xl">Được tin dùng bởi cộng đồng yêu trà</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="wellness-surface p-5 text-center">
                            <div className="mb-2 text-3xl font-black text-primary-700 md:text-4xl">{stat.value}</div>
                            <div className="text-sm font-bold text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
