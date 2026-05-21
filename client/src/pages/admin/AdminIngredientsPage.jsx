import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminIngredientsPage = () => {
    const [ingredients, setIngredients] = useState([]);

    const fetchIngredients = async () => {
        const { data } = await api.get('/admin/ingredients');
        setIngredients(data || []);
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const updateIngredient = async (ingredient) => {
        await api.patch(`/admin/ingredients/${ingredient._id}`, {
            name: ingredient.name,
            description: ingredient.description,
            pricePerGram: ingredient.pricePerGram,
        });
        fetchIngredients();
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Quản lý nguyên liệu</h2>
            <div className="space-y-4">
                {ingredients.map((ingredient) => (
                    <div key={ingredient._id} className="rounded-3xl border border-gray-100 p-4 grid grid-cols-1 xl:grid-cols-[1fr_2fr_180px_120px] gap-4 items-center">
                        <input
                            value={ingredient.name}
                            onChange={(e) => setIngredients((prev) => prev.map((item) => item._id === ingredient._id ? { ...item, name: e.target.value } : item))}
                            className="px-4 py-3 rounded-2xl border border-gray-200"
                        />
                        <input
                            value={ingredient.description || ''}
                            onChange={(e) => setIngredients((prev) => prev.map((item) => item._id === ingredient._id ? { ...item, description: e.target.value } : item))}
                            className="px-4 py-3 rounded-2xl border border-gray-200"
                        />
                        <input
                            type="number"
                            value={ingredient.pricePerGram}
                            onChange={(e) => setIngredients((prev) => prev.map((item) => item._id === ingredient._id ? { ...item, pricePerGram: Number(e.target.value) } : item))}
                            className="px-4 py-3 rounded-2xl border border-gray-200"
                        />
                        <button onClick={() => updateIngredient(ingredient)} className="px-5 py-3 rounded-2xl bg-primary-600 text-white font-bold">
                            Lưu
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminIngredientsPage;
