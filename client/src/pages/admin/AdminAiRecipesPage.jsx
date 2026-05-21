import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminAiRecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [approvalDrafts, setApprovalDrafts] = useState({});

    const fetchRecipes = async () => {
        const { data } = await api.get('/admin/ai-recipes');
        setRecipes(data || []);
        setApprovalDrafts(
            (data || []).reduce((acc, recipe) => {
                acc[recipe._id] = {
                    price: recipe.pricingDraft?.price || 299000,
                    stock: recipe.pricingDraft?.stock || 10,
                    note: 'Approved in AI module',
                };
                return acc;
            }, {})
        );
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const approveRecipe = async (id) => {
        await api.post(`/admin/ai-recipes/${id}/approve`, approvalDrafts[id] || {});
        fetchRecipes();
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Duyệt công thức AI</h2>
            <div className="space-y-4">
                {recipes.filter((item) => item.lifecycleStatus === 'submitted_for_sale').map((item) => (
                    <div key={item._id} className="rounded-3xl border border-gray-100 p-5 space-y-4">
                        <div>
                            <p className="font-bold text-gray-900">{item.result?.teaName || 'AI Recipe'}</p>
                            <p className="text-sm text-gray-500">{item.user?.name}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(item.result?.ingredients || []).slice(0, 6).map((ingredient, index) => (
                                <span key={`${typeof ingredient === 'object' ? ingredient.name : ingredient}-${index}`} className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-600">
                                    {typeof ingredient === 'object' ? ingredient.name : ingredient}
                                </span>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                value={approvalDrafts[item._id]?.price || 299000}
                                onChange={(e) => setApprovalDrafts((prev) => ({ ...prev, [item._id]: { ...prev[item._id], price: Number(e.target.value) } }))}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                            />
                            <input
                                type="number"
                                value={approvalDrafts[item._id]?.stock || 10}
                                onChange={(e) => setApprovalDrafts((prev) => ({ ...prev, [item._id]: { ...prev[item._id], stock: Number(e.target.value) } }))}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                            />
                        </div>
                        <textarea
                            value={approvalDrafts[item._id]?.note || ''}
                            onChange={(e) => setApprovalDrafts((prev) => ({ ...prev, [item._id]: { ...prev[item._id], note: e.target.value } }))}
                            rows="3"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200"
                        />
                        <button onClick={() => approveRecipe(item._id)} className="px-5 py-3 rounded-2xl bg-primary-600 text-white font-bold">
                            Duyệt công thức
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAiRecipesPage;
