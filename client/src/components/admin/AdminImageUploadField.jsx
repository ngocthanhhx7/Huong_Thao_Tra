import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { AdminButton, FormField } from './AdminUi';
import { adminInputClass } from './adminUtils';

const AdminImageUploadField = ({ value = '', onChange, folder, label, hint }) => {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);

        try {
            setUploading(true);
            setError('');
            const { data } = await api.post('/uploads/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onChange(data.url);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể upload ảnh lên S3.');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    return (
        <FormField label={label} hint={hint}>
            <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        className={`${adminInputClass} min-w-0 flex-1`}
                        placeholder="https://..."
                    />
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <AdminButton
                        variant="neutral"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="shrink-0"
                    >
                        {uploading ? 'Đang upload...' : 'Chọn ảnh'}
                    </AdminButton>
                </div>

                {value ? (
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <img
                            src={value}
                            alt=""
                            className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <p className="min-w-0 break-all text-xs font-bold leading-5 text-slate-500">{value}</p>
                    </div>
                ) : null}

                {error ? <p className="text-xs font-bold text-red-600">{error}</p> : null}
            </div>
        </FormField>
    );
};

AdminImageUploadField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    folder: PropTypes.oneOf(['teas', 'ingredients', 'posts']).isRequired,
    label: PropTypes.string.isRequired,
    hint: PropTypes.string,
};

export default AdminImageUploadField;
