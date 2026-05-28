import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const buttonVariants = {
    primary: 'admin-btn admin-btn-primary',
    secondary: 'admin-btn admin-btn-secondary',
    neutral: 'admin-btn admin-btn-neutral',
    danger: 'admin-btn admin-btn-danger',
};

const badgeTones = {
    green: 'bg-[#E5F8D7] text-[#2F7D14] border-[#A9E878]',
    purple: 'bg-[#F3E6FF] text-[#7A28A9] border-[#DDB7FF]',
    yellow: 'bg-[#FFF4BF] text-[#8A5A00] border-[#FFE06B]',
    red: 'bg-[#FFE5E5] text-[#A62929] border-[#FFB6B6]',
    blue: 'bg-[#E5F0FF] text-[#2455A6] border-[#BBD3FF]',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const AdminPageHeader = ({ eyebrow, title, description, meta, actions }) => (
    <section className="admin-page-header">
        <div className="min-w-0">
            {eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}
            <h1 className="text-2xl md:text-3xl font-black text-slate-950">{title}</h1>
            {description && <p className="mt-2 max-w-3xl text-sm md:text-base leading-6 text-slate-600">{description}</p>}
            {meta && <div className="mt-4 flex flex-wrap gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </section>
);

AdminPageHeader.propTypes = {
    eyebrow: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    meta: PropTypes.node,
    actions: PropTypes.node,
};

export const AdminPanel = ({ title, description, actions, children, className = '' }) => (
    <section className={`admin-panel ${className}`}>
        {(title || description || actions) && (
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    {title && <h2 className="text-xl font-black text-slate-950">{title}</h2>}
                    {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
        )}
        {children}
    </section>
);

AdminPanel.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    actions: PropTypes.node,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export const MetricCard = ({ label, value, caption, tone = 'green' }) => (
    <div className={`admin-metric admin-metric-${tone}`}>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-3 text-2xl md:text-3xl font-black text-slate-950">{value}</p>
        {caption && <p className="mt-2 text-sm text-slate-600">{caption}</p>}
    </div>
);

MetricCard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    caption: PropTypes.string,
    tone: PropTypes.oneOf(['green', 'purple', 'yellow', 'red', 'blue', 'slate']),
};

export const StatusBadge = ({ children, tone = 'slate' }) => (
    <span className={`inline-flex min-h-8 items-center rounded-lg border px-3 py-1 text-xs font-black ${badgeTones[tone] || badgeTones.slate}`}>
        {children}
    </span>
);

StatusBadge.propTypes = {
    children: PropTypes.node.isRequired,
    tone: PropTypes.oneOf(Object.keys(badgeTones)),
};

export const AdminButton = ({ children, variant = 'primary', className = '', type = 'button', ...props }) => (
    <button type={type} className={`${buttonVariants[variant] || buttonVariants.primary} ${className}`} {...props}>
        {children}
    </button>
);

AdminButton.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(Object.keys(buttonVariants)),
    className: PropTypes.string,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export const AdminLinkButton = ({ children, to, variant = 'primary', className = '' }) => (
    <Link to={to} className={`${buttonVariants[variant] || buttonVariants.primary} ${className}`}>
        {children}
    </Link>
);

AdminLinkButton.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(Object.keys(buttonVariants)),
    className: PropTypes.string,
};

export const FormField = ({ label, hint, children }) => (
    <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
        {children}
        {hint && <span className="mt-2 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
);

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    hint: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export const EmptyState = ({ title, description, action }) => (
    <div className="admin-empty">
        <p className="text-lg font-black text-slate-950">{title}</p>
        {description && <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
    </div>
);

EmptyState.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    action: PropTypes.node,
};

export const LoadingState = ({ rows = 4 }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="admin-skeleton h-16" />
        ))}
    </div>
);

LoadingState.propTypes = {
    rows: PropTypes.number,
};

export const ErrorState = ({ message, onRetry }) => (
    <div className="admin-error">
        <div>
            <p className="font-black text-red-700">Không tải được dữ liệu</p>
            <p className="mt-1 text-sm text-red-700/80">{message}</p>
        </div>
        {onRetry && (
            <AdminButton variant="danger" onClick={onRetry}>
                Thử lại
            </AdminButton>
        )}
    </div>
);

ErrorState.propTypes = {
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func,
};
