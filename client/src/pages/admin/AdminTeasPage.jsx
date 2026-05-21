import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminTeasPage = () => {
    const [teas, setTeas] = useState([]);

    const fetchTeas = async () => {
        const { data } = await api.get('/admin/teas');
        setTeas(data || []);
    };

    useEffect(() => {
        fetchTeas();
    }, []);

    const updateTea = async (tea) => {
        await api.patch(`/admin/teas/${tea._id}`, {
            price: tea.price,
            stock: tea.stock,
            isPublished: tea.isPublished,
        });
        fetchTeas();
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Quản lý sản phẩm trà</h2>
            <div className="space-y-4">
                {teas.map((tea) => (
                    <div key={tea._id} className="rounded-3xl border border-gray-100 p-4 flex flex-col xl:flex-row xl:items-center gap-4">
                        <img src={tea.image} alt={tea.name} className="w-20 h-20 rounded-2xl object-cover" />
                        <div className="flex-1">
                            <p className="font-bold text-gray-900">{tea.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{tea.ingredients?.map((item) => item.name).join(', ')}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 xl:w-[420px]">
                            <input
                                type="number"
                                value={tea.price}
                                onChange={(e) => setTeas((prev) => prev.map((item) => item._id === tea._id ? { ...item, price: Number(e.target.value) } : item))}
                                className="px-4 py-3 rounded-2xl border border-gray-200"
                            />
                            <input
                                type="number"
                                value={tea.stock}
                                onChange={(e) => setTeas((prev) => prev.map((item) => item._id === tea._id ? { ...item, stock: Number(e.target.value) } : item))}
                                className="px-4 py-3 rounded-2xl border border-gray-200"
                            />
                            <select
                                value={tea.isPublished ? 'published' : 'draft'}
                                onChange={(e) => setTeas((prev) => prev.map((item) => item._id === tea._id ? { ...item, isPublished: e.target.value === 'published' } : item))}
                                className="px-4 py-3 rounded-2xl border border-gray-200"
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <button onClick={() => updateTea(tea)} className="px-5 py-3 rounded-2xl bg-primary-600 text-white font-bold">
                            Lưu
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTeasPage;
