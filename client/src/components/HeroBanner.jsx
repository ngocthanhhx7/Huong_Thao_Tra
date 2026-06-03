import { Link } from 'react-router-dom';

const HeroBanner = () => {
    return (
        <section className="relative overflow-hidden bg-[#f6faee] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(178,216,126,0.42),transparent_30%),radial-gradient(circle_at_84%_12%,rgba(242,205,139,0.36),transparent_28%),linear-gradient(180deg,#fbfff4_0%,#eef8e8_100%)]" />
            <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full border-[38px] border-emerald-200/30" />
            <div className="pointer-events-none absolute right-10 top-28 h-40 w-28 rotate-45 rounded-full bg-lime-200/50 blur-xl" />
            <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/85 px-4 py-2 text-sm font-extrabold text-emerald-800 shadow-sm">
                        <span>ðŸŒ¿</span> Wellness tea powered by AI
                    </p>
                    <h1 className="font-display-h1 max-w-4xl text-5xl leading-[0.95] text-[#27451f] md:text-7xl">
                        TrÃ  tháº£o má»™c Ä‘Æ°á»£c mix riÃªng cho nhá»‹p sá»‘ng cá»§a báº¡n
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
                        Trà Hoa Việt káº¿t há»£p nguyÃªn liá»‡u tá»± nhiÃªn, gu thÆ°á»Ÿng trÃ  vÃ  AI tÆ° váº¥n Ä‘á»ƒ táº¡o cÃ´ng thá»©c cÃ¢n báº±ng cho giáº¥c ngá»§, tinh tháº§n, tiÃªu hÃ³a vÃ  thÃ³i quen háº±ng ngÃ y.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link to="/ai-mix" className="wellness-focus inline-flex min-h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-800 to-lime-600 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5">
                            Thá»­ AI Mix TrÃ  ngay
                        </Link>
                        <Link to="/teas" className="wellness-focus inline-flex min-h-14 items-center justify-center rounded-2xl border border-emerald-100 bg-white/90 px-7 py-4 text-base font-extrabold text-[#27451f] transition hover:bg-emerald-50">
                            KhÃ¡m phÃ¡ cá»­a hÃ ng
                        </Link>
                    </div>

                    <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
                        {[['2 phÃºt', 'tráº£ lá»i nhanh'], ['13+', 'tiÃªu chÃ­ cÃ¡ nhÃ¢n'], ['100%', 'trÃ¡nh nguyÃªn liá»‡u ká»µ']].map(([value, label]) => (
                            <div key={value} className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur">
                                <p className="text-2xl font-black text-emerald-800">{value}</p>
                                <p className="mt-1 text-xs font-bold text-gray-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -left-12 -top-10 hidden rounded-3xl bg-white/90 p-4 shadow-xl shadow-emerald-100 md:block z-10">
                        <p className="text-xs font-extrabold uppercase text-gray-400">Step 01</p>
                        <p className="font-black text-emerald-800">Chá»n má»¥c tiÃªu</p>
                    </div>
                    <div className="absolute -right-12 bottom-12 hidden rounded-3xl bg-[#fff8e6] p-4 shadow-xl shadow-amber-100 md:block z-10">
                        <p className="text-xs font-extrabold uppercase text-amber-600">AI result</p>
                        <p className="font-black text-[#6f4b16]">CÃ´ng thá»©c cÃ¢n báº±ng</p>
                    </div>
                    <div className="overflow-hidden rounded-[40px] border border-white/80 bg-white/75 p-5 shadow-2xl shadow-emerald-100/60 backdrop-blur">
                    <div className="rounded-[32px] bg-gradient-to-br from-[#edf8df] via-white to-[#fff3d8] p-6">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-black uppercase text-emerald-700">Gá»£i Ã½ hÃ´m nay</p>
                                <h2 className="font-display-h1 mt-1 text-4xl text-[#27451f]">TrÃ  ngá»§ ngon dá»‹u nháº¹</h2>
                            </div>
                            <span className="rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-emerald-700 ring-1 ring-emerald-100">AI</span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl border border-emerald-100 bg-white/90 p-4">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                    <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.2 10.1A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.9L5 8Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8V6a4 4 0 0 1 8 0v2M9 13h6" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold text-gray-500">Má»¥c tiÃªu</p>
                                <p className="mt-1 text-lg font-black text-[#27451f]">Ngá»§ ngon hÆ¡n</p>
                            </div>
                            <div className="rounded-3xl border border-amber-100 bg-white/90 p-4">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                                    <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M6 7c4 0 6 2 6 6-4 0-6-2-6-6ZM18 7c-4 0-6 2-6 6 4 0 6-2 6-6Z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold text-gray-500">HÆ°Æ¡ng vá»‹</p>
                                <p className="mt-1 text-lg font-black text-[#27451f]">Hoa cÃºc Â· tÃ¡o Ä‘á»</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-3xl border border-emerald-100 bg-white/90 p-4">
                            <p className="text-sm font-bold text-gray-500">ThÃ nh pháº§n gá»£i Ã½</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {['Hoa cÃºc', 'TÃ¡o Ä‘á»', 'LÃ¡ báº¡c hÃ ', 'Cam tháº£o'].map((item) => (
                                    <span key={item} className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-extrabold text-emerald-700">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;

