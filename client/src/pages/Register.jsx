import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, username, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
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
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tạo Tài Khoản</h2>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Khởi đầu hành trình thưởng trà tuyệt vời của bạn</p>
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
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">hoặc đăng ký bằng Email</span>
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
                            <label className="block text-sm font-bold text-gray-700">Họ và tên</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all font-medium outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-gray-700">Tên Đăng Nhập (Username)</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Tối thiểu 4 ký tự không dấu..."
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all font-medium outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all font-medium outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Tối thiểu 6 ký tự"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all font-medium outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-2xl font-bold hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[0.98] mt-4 transition-all duration-300">
                            Đăng Ký
                        </button>
                    </form>
                    <p className="text-sm text-center text-gray-500 mt-8 font-medium">
                        Đã có tài khoản? <Link to="/login" className="text-primary-600 hover:text-primary-800 font-extrabold ml-1">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
