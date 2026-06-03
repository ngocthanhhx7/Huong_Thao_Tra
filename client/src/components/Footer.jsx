import { Link } from 'react-router-dom';

const socialLinks = [
    { label: 'Facebook', href: '#', icon: '/assets/icon/khac/ic_baseline-facebook.svg' },
    { label: 'Instagram', href: '#', icon: '/assets/icon/khac/Instagram.svg' },
    { label: 'TikTok', href: '#', icon: '/assets/icon/khac/Tiktok.svg' },
];

const Footer = () => {
    return (
        <footer className="border-t border-leaf-100 bg-white px-4 pb-8 pt-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-8">
                    <div className="md:col-span-2">
                        <div className="mb-5 flex items-center gap-3">
                            <img src="/logo.png" alt="Trà Hoa Việt" className="h-11 w-11 rounded-lg object-cover ring-1 ring-primary-100" />
                            <span className="text-2xl font-black text-leaf-800">Trà Hoa Việt</span>
                        </div>
                        <p className="max-w-md text-sm leading-7 text-gray-600 md:text-base">
                            TrÃ  tháº£o má»™c vÃ  cÃ´ng thá»©c AI cÃ¡ nhÃ¢n hÃ³a cho nhá»‹p sá»‘ng khá»e. ChÃºng tÃ´i káº¿t há»£p nguyÃªn liá»‡u tá»± nhiÃªn, kiáº¿n thá»©c chÄƒm sÃ³c sá»©c khá»e vÃ  tráº£i nghiá»‡m mua sáº¯m rÃµ rÃ ng.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="wellness-focus flex h-10 w-10 items-center justify-center rounded-lg border border-leaf-100 bg-leaf-50 text-primary-700 transition hover:bg-primary-50"
                                    aria-label={item.label}
                                >
                                    <img src={item.icon} alt="" className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-black uppercase text-leaf-800">Menu</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">Trang chá»§</Link></li>
                            <li><Link to="/teas" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">Cá»­a hÃ ng</Link></li>
                            <li><Link to="/ai-mix" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">AI Pha TrÃ </Link></li>
                            <li><Link to="/about" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">Giá»›i thiá»‡u</Link></li>
                            <li><Link to="/contact" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">LiÃªn há»‡</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-black uppercase text-leaf-800">LiÃªn há»‡</h3>
                        <ul className="space-y-4 text-sm font-bold text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5A2.5 2.5 0 0 1 5.5 3h2L10 8l-2 1.5A12 12 0 0 0 14.5 16l1.5-2 5 2.5v2A2.5 2.5 0 0 1 18.5 21 15.5 15.5 0 0 1 3 5.5Z" />
                                    </svg>
                                </span>
                                <span>0876785504</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                                    </svg>
                                </span>
                                <span className="break-all">thanhnnhe186491@fpt.edu.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-leaf-100 pt-6 text-sm font-semibold text-gray-500 md:flex-row md:items-center md:justify-between">
                    <p>Â© {new Date().getFullYear()} Trà Hoa Việt. Táº¥t cáº£ quyá»n Ä‘Æ°á»£c báº£o lÆ°u.</p>
                    <div className="flex gap-4">
                        <Link to="#" className="wellness-focus rounded-lg hover:text-primary-700">Äiá»u khoáº£n</Link>
                        <Link to="#" className="wellness-focus rounded-lg hover:text-primary-700">Báº£o máº­t</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

