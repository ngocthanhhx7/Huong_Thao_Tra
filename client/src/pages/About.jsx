const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-28 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-amber-50 -z-10"></div>
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary-400/10 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-primary-50 text-primary-700 font-bold text-sm tracking-wide uppercase mb-6 border border-primary-100">CÃ‚U CHUYá»†N Cá»¦A CHÃšNG TÃ”I</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Vá» <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Trà Hoa Việt</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        KhÃ¡m phÃ¡ hÃ nh trÃ¬nh cá»§a chÃºng tÃ´i trong viá»‡c káº¿t há»£p cÃ´ng nghá»‡ AI tiÃªn tiáº¿n vá»›i tri thá»©c cá»• truyá»n vá» tháº£o má»™c.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block w-12 h-1.5 bg-primary-500 rounded-full mb-6"></span>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Sá»© má»‡nh cá»§a chÃºng tÃ´i</h2>
                            <p className="text-gray-600 mb-6 text-lg font-medium leading-relaxed">
                                Táº¡i Trà Hoa Việt, sá»© má»‡nh cá»§a chÃºng tÃ´i lÃ  cÃ¡ch máº¡ng hÃ³a cÃ¡ch má»i ngÆ°á»i tiáº¿p cáº­n sá»©c khá»e tá»± nhiÃªn.
                                ChÃºng tÃ´i tin ráº±ng sá»©c khá»e nÃªn dá»… tiáº¿p cáº­n, cÃ¡ nhÃ¢n hÃ³a vÃ  dá»±a trÃªn khoa há»c.
                            </p>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Báº±ng cÃ¡ch káº¿t há»£p trÃ­ tuá»‡ nhÃ¢n táº¡o vá»›i kiáº¿n thá»©c cá»• xÆ°a vá» tháº£o má»™c, chÃºng tÃ´i táº¡o ra nhá»¯ng tráº£i nghiá»‡m
                                trÃ  Ä‘á»™c Ä‘Ã¡o, Ä‘Æ°á»£c thiáº¿t káº¿ riÃªng cho nhu cáº§u sá»©c khá»e cá»§a tá»«ng cÃ¡ nhÃ¢n.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-primary-50 to-white rounded-[2rem] p-10 border border-primary-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full opacity-50 -z-10"></div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-center group">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-primary-50 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 text-primary-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Äá»•i má»›i</h3>
                                </div>
                                <div className="text-center group">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-primary-50 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 text-primary-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">ChÄƒm sÃ³c</h3>
                                </div>
                                <div className="text-center group">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-primary-50 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 text-primary-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Khoa há»c</h3>
                                </div>
                                <div className="text-center group">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-primary-50 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 text-primary-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">Tá»± nhiÃªn</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-24 px-4 bg-gray-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 outline-none relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-400 to-amber-300 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                            <img
                                src="/about-vision.jpg"
                                alt="Vision"
                                className="relative rounded-[2.5rem] shadow-2xl object-cover h-[500px] w-full"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                }}
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <span className="inline-block w-12 h-1.5 bg-amber-400 rounded-full mb-6"></span>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Táº§m nhÃ¬n cá»§a chÃºng tÃ´i</h2>
                            <p className="text-gray-600 mb-8 text-lg font-medium leading-relaxed">
                                ChÃºng tÃ´i hÃ¬nh dung má»™t tháº¿ giá»›i nÆ¡i sá»©c khá»e tá»± nhiÃªn khÃ´ng chá»‰ dá»… tiáº¿p cáº­n mÃ  cÃ²n Ä‘Æ°á»£c cÃ¡ nhÃ¢n hÃ³a
                                hoÃ n háº£o cho tá»«ng cÃ¡ nhÃ¢n. Báº±ng cÃ¡ch sá»­ dá»¥ng sá»©c máº¡nh cá»§a trÃ­ tuá»‡ nhÃ¢n táº¡o, chÃºng tÃ´i Ä‘ang má»Ÿ ra
                                má»™t ká»· nguyÃªn má»›i cá»§a chÄƒm sÃ³c sá»©c khá»e phÃ²ng ngá»«a.
                            </p>
                            <ul className="space-y-4 text-gray-700 font-bold">
                                <li className="flex items-start bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="bg-primary-50 rounded-lg p-1 mr-4">
                                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="pt-0.5">Trá»Ÿ thÃ nh ná»n táº£ng hÃ ng Ä‘áº§u vá» trÃ  tháº£o má»™c AI</span>
                                </li>
                                <li className="flex items-start bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="bg-primary-50 rounded-lg p-1 mr-4">
                                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="pt-0.5">Äá»•i má»›i liÃªn tá»¥c trong cÃ´ng nghá»‡ AI sá»©c khá»e</span>
                                </li>
                                <li className="flex items-start bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="bg-primary-50 rounded-lg p-1 mr-4">
                                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="pt-0.5">GiÃ¡o dá»¥c cá»™ng Ä‘á»“ng vá» lá»£i Ã­ch tháº£o má»™c</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Technology Section */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-primary-50 text-primary-700 font-bold text-sm tracking-wide uppercase mb-6 border border-primary-100">Cá»T LÃ•I CÃ”NG NGHá»†</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">CÃ´ng nghá»‡ AI trong chÄƒm sÃ³c sá»©c khá»e</h2>
                    <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
                        ChÃºng tÃ´i sá»­ dá»¥ng cÃ¡c thuáº­t toÃ¡n AI tiÃªn tiáº¿n Ä‘á»ƒ phÃ¢n tÃ­ch nhu cáº§u sá»©c khá»e cÃ¡ nhÃ¢n vÃ  táº¡o ra
                        nhá»¯ng cÃ´ng thá»©c trÃ  Ä‘Æ°á»£c tá»‘i Æ°u hÃ³a hoÃ n háº£o.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-4">PhÃ¢n tÃ­ch cÃ¡ nhÃ¢n</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                AI phÃ¢n tÃ­ch sá»Ÿ thÃ­ch, thÃ³i quen vÃ  nhu cáº§u sá»©c khá»e Ä‘á»ƒ táº¡o cÃ´ng thá»©c phÃ¹ há»£p tuyá»‡t Ä‘á»‘i.
                            </p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-4">NguyÃªn liá»‡u organic</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Táº¥t cáº£ nguyÃªn liá»‡u Ä‘á»u Ä‘Æ°á»£c chá»n lá»c ká»¹ cÃ ng tá»« cÃ¡c nÃ´ng tráº¡i organic uy tÃ­n, cháº¥t lÆ°á»£ng nháº¥t.
                            </p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 mb-4">Äáº£m báº£o cháº¥t lÆ°á»£ng</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Má»—i cÃ´ng thá»©c Ä‘á»u Ä‘Æ°á»£c kiá»ƒm tra vÃ  tá»‘i Æ°u hÃ³a Ä‘á»ƒ Ä‘áº£m báº£o hiá»‡u quáº£ tá»‘i Ä‘a cho báº¡n.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Báº¯t Ä‘áº§u hÃ nh trÃ¬nh sá»©c khá»e cá»§a báº¡n</h2>
                    <p className="text-primary-100 mb-10 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                        Thá»­ nghiá»‡m cÃ´ng nghá»‡ AI tiÃªn tiáº¿n cá»§a chÃºng tÃ´i vÃ  khÃ¡m phÃ¡ cÃ´ng thá»©c trÃ  phÃ¹ há»£p vÃ  mang láº¡i hiá»‡u quáº£ tá»‘t nháº¥t vá»›i báº¡n.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <a href="/ai-mix" className="bg-white text-primary-700 px-8 py-4 rounded-2xl font-extrabold text-lg shadow-xl shadow-primary-900/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                            Thá»­ AI Pha TrÃ 
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </a>
                        <a href="/teas" className="bg-primary-800/40 text-white backdrop-blur-md border border-primary-400/30 px-8 py-4 rounded-2xl font-extrabold text-lg hover:bg-primary-800/60 transition-all duration-300 flex items-center justify-center gap-2">
                            Xem Cá»­a HÃ ng
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
