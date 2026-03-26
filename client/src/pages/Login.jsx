import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(identifier, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Tài khoản Google lỗi');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white p-10 py-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-amber-500"></div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Chào Mừng Trở Lại</h2>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Đăng nhập để vào thế giới trà của riêng bạn</p>
                    </div>

                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Đã có lỗi xảy ra khi gọi Google API')}
                            theme="outline"
                            size="large"
                            text="continue_with"
                            width="320"
                        />
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">hoặc đăng nhập bằng Email</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    {error && (
                        <div className="bg-red-50/50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-gray-700">Tên đăng nhập hoặc Email</label>
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                placeholder="Ví dụ: thuongtra123 hoặc abc@gmail.com"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all font-medium outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
                                <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors">Quên mật khẩu?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all font-medium outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-2xl font-bold hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] mt-4 transition-all duration-300">
                            Đăng Nhập
                        </button>
                    </form>
                    <p className="text-sm text-center text-gray-500 mt-8 font-medium">
                        Chưa có tài khoản? <Link to="/register" className="text-primary-600 hover:text-primary-800 font-extrabold ml-1">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;