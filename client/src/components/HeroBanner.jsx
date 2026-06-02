import { Link } from 'react-router-dom';

const HeroBanner = () => {
    return (
        <section className="bg-leaf-50 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <p className="mb-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-extrabold uppercase text-primary-700 ring-1 ring-primary-100">
                        Công thức trà thảo mộc cá nhân hóa
                    </p>
                    <h1 className="max-w-3xl text-4xl font-black leading-tight text-leaf-800 md:text-6xl">
                        Trà thảo mộc cho nhịp sống khỏe và dễ cân bằng hơn
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
                        Hương Thảo Trà kết hợp nguyên liệu tự nhiên với AI tư vấn để gợi ý hương vị, công dụng và cách dùng phù hợp với thói quen của bạn.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link to="/ai-mix" className="wellness-focus inline-flex min-h-12 items-center justify-center rounded-lg bg-primary-700 px-6 py-3 text-base font-extrabold text-white transition hover:bg-primary-600">
                            Thử AI Pha Trà
                        </Link>
                        <Link to="/teas" className="wellness-focus inline-flex min-h-12 items-center justify-center rounded-lg border border-leaf-100 bg-white px-6 py-3 text-base font-extrabold text-leaf-800 transition hover:bg-leaf-50">
                            Khám phá cửa hàng
                        </Link>
                    </div>
                </div>

                <div className="wellness-surface overflow-hidden p-5">
                    <div className="rounded-xl bg-gradient-to-br from-cream via-white to-leaf-50 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black uppercase text-primary-700">Gợi ý hôm nay</p>
                                <h2 className="mt-1 text-2xl font-black text-leaf-800">Trà thư giãn buổi tối</h2>
                            </div>
                            <span className="rounded-lg bg-white px-3 py-2 text-sm font-extrabold text-primary-700 ring-1 ring-primary-100">AI</span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-leaf-100 bg-white p-4">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                                    <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.2 10.1A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.9L5 8Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8V6a4 4 0 0 1 8 0v2M9 13h6" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold text-gray-500">Mục tiêu</p>
                                <p className="mt-1 text-lg font-black text-leaf-800">Ngủ ngon hơn</p>
                            </div>
                            <div className="rounded-xl border border-leaf-100 bg-white p-4">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                    <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M6 7c4 0 6 2 6 6-4 0-6-2-6-6ZM18 7c-4 0-6 2-6 6 4 0 6-2 6-6Z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold text-gray-500">Hương vị</p>
                                <p className="mt-1 text-lg font-black text-leaf-800">Thanh mát dịu</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-leaf-100 bg-white p-4">
                            <p className="text-sm font-bold text-gray-500">Thành phần gợi ý</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {['Hoa cúc', 'Táo đỏ', 'Lá bạc hà', 'Cam thảo'].map((item) => (
                                    <span key={item} className="rounded-lg bg-leaf-50 px-3 py-2 text-sm font-extrabold text-primary-700">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
