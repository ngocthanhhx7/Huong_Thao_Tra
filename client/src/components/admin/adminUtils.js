export const adminInputClass = 'admin-input';
export const adminSelectClass = 'admin-input admin-select';
export const adminTextareaClass = 'admin-input min-h-[112px] resize-y';

export const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

export const formatDateTime = (value) => {
    if (!value) {
        return 'Chưa có';
    }

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value));
};
