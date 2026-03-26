import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

const ActivatePro = () => {
    const [code, setCode] = useState('');
    const [isActivating, setIsActivating] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsActivating(true);
        setMessage('');

        try {
            // Mock activation - replace with real API call
            if (code === 'PRO2024') {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setMessage('Kích hoạt Pro thành công! Tài khoản của bạn đã được nâng cấp.');
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            } else {
                setMessage('Mã kích hoạt không hợp lệ. Vui lòng kiểm tra lại.');
            }
        } catch {
            setMessage('Có lỗi xảy ra khi kích hoạt. Vui lòng thử lại.');
        } finally {
            setIsActivating(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-amber-50/50 -z-10"></div>
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[80px] -z-10"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 border border-primary-100/50 shadow-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Kích hoạt Pro</h1>
                        <p className="text-gray-600 font-medium">Nhập mã kích hoạt để nâng cấp lên tài khoản cao cấp</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mã kích hoạt</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="Nhập mã kích hoạt"
                                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-xl font-mono tracking-[0.2em] uppercase font-bold text-gray-800 transition-all"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-2xl text-center text-sm font-medium border flex items-center justify-center gap-2 ${message.includes('thành công')
                                    ? 'bg-primary-50 text-primary-800 border-primary-100'
                                    : 'bg-red-50 text-red-800 border-red-100'
                                }`}>
                                {message.includes('thành công') ? (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                ) : (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                )}
                                <span>{message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isActivating}
                            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isActivating ? (
                                <>
                                    <svg className="animate-spin -ml-1 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang kích hoạt...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Kích hoạt Pro
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-500 font-medium">
                            Mã kích hoạt được cung cấp khi mua sản phẩm hoặc liên hệ hỗ trợ.
                        </p>
                        <a href="/contact" className="text-primary-600 hover:text-primary-700 text-sm font-bold mt-2 inline-flex items-center gap-1 hover:underline underline-offset-4">
                            Liên hệ hỗ trợ
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivatePro;