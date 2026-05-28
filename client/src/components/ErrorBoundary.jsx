import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary - bắt các lỗi render trong cây React phía dưới.
 * Nếu có lỗi, hiển thị trang ServerError (500) với tuỳ chọn reload.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log lỗi để debug, có thể thay bằng dịch vụ logging (Sentry, ...)
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            const isDev = import.meta.env?.MODE !== 'production';
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-amber-50 px-4">
                    <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-red-100 p-8 md:p-12 text-center">
                        <div className="text-7xl mb-4">⚠️</div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                            Đã xảy ra lỗi không mong muốn
                        </h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Ứng dụng vừa gặp sự cố. Bạn vui lòng thử tải lại trang
                            hoặc quay về trang chủ. Nếu lỗi tiếp diễn, hãy liên hệ
                            đội hỗ trợ Hương Thảo Trà.
                        </p>

                        {isDev && this.state.error && (
                            <pre className="text-left text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 overflow-auto max-h-40 text-red-600">
                                {String(this.state.error?.message || this.state.error)}
                            </pre>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow hover:opacity-95"
                            >
                                Tải lại trang
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
