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
                            Trà thảo mộc và công thức AI cá nhân hóa cho nhịp sống khỏe. Chúng tôi kết hợp nguyên liệu tự nhiên, kiến thức chăm sóc sức khỏe và trải nghiệm mua sắm rõ ràng.
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
                            <li><Link to="/" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">Trang chủ</Link></li>
                            <li><Link to="/teas" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">Cửa hàng</Link></li>
                            <li><Link to="/ai-mix" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">AI Pha Trà</Link></li>
                            <li><Link to="/ingredients" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">Trà liệu</Link></li>
                            <li><Link to="/about" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">Giới thiệu</Link></li>
                            <li><Link to="/contact" className="wellness-focus inline-flex rounded-lg text-sm font-bold text-gray-600 hover:text-primary-700">Liên hệ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-5 text-sm font-black uppercase text-leaf-800">Liên hệ</h3>
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
                    <p>© {new Date().getFullYear()} Trà Hoa Việt. Tất cả quyền được bảo lưu.</p>
                    <div className="flex gap-4">
                        <Link to="#" className="wellness-focus rounded-lg hover:text-primary-700">Điều khoản</Link>
                        <Link to="#" className="wellness-focus rounded-lg hover:text-primary-700">Bảo mật</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

