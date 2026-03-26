import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-1.5 bg-primary-50 rounded-full">
                                <span className="text-2xl">🌿</span>
                            </div>
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 tracking-tight">Hương Thảo Trà</span>
                        </div>
                        <p className="text-gray-500 mb-8 max-w-sm leading-relaxed text-sm md:text-base">
                            Khám phá tương lai của trà thảo mộc với AI cá nhân hóa. Chúng tôi kết hợp nguyên liệu tự nhiên và công nghệ hiện đại.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors bg-gray-50 hover:bg-primary-50 p-2.5 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors bg-gray-50 hover:bg-primary-50 p-2.5 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b-2 border-primary-500 inline-block pb-1">Menu</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-500 hover:text-primary-600 hover:pl-2 transition-all duration-200 text-sm font-medium">Trang chủ</Link></li>
                            <li><Link to="/teas" className="text-gray-500 hover:text-primary-600 hover:pl-2 transition-all duration-200 text-sm font-medium">Cửa hàng</Link></li>
                            <li><Link to="/ai-mix" className="text-gray-500 hover:text-primary-600 hover:pl-2 transition-all duration-200 text-sm font-medium">AI Pha Trà</Link></li>
                            <li><Link to="/ai-plan" className="text-gray-500 hover:text-primary-600 hover:pl-2 transition-all duration-200 text-sm font-medium">Liệu trình AI</Link></li>
                            <li><Link to="/about" className="text-gray-500 hover:text-primary-600 hover:pl-2 transition-all duration-200 text-sm font-medium">Giới thiệu</Link></li>
                            <li><Link to="/contact" className="text-gray-500 hover:text-primary-600 hover:pl-2 transition-all duration-200 text-sm font-medium">Liên hệ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b-2 border-primary-500 inline-block pb-1">Liên hệ</h3>
                        <ul className="space-y-4 text-gray-500 text-sm font-medium">
                            <li className="flex items-start gap-3">
                                <span className="text-primary-500 text-lg">📞</span> 
                                <span>0876785504</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary-500 text-lg">✉️</span> 
                                <span>thanhnnhe186491@fpt.edu.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm font-medium">
                        © {new Date().getFullYear()} Hương Thảo Trà. Tất cả quyền được bảo lưu.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-400 font-medium">
                        <Link to="#" className="hover:text-primary-600 transition-colors">Điều khoản</Link>
                        <Link to="#" className="hover:text-primary-600 transition-colors">Bảo mật</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;