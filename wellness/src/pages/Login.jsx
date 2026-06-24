import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-50 to-cream flex items-center justify-center px-4 safe-bottom">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src="/wellness/logo.png" alt="Trà Hoa Việt" className="h-16 w-16 rounded-2xl object-cover ring-1 ring-primary-100 shadow-md mb-3" />
          <h1 className="text-xl font-bold text-secondary">Trà Hoa Việt</h1>
          <p className="text-sm text-gray-500">Đăng nhập để tiếp tục</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email / Tên đăng nhập
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="nguyenvana@gmail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
