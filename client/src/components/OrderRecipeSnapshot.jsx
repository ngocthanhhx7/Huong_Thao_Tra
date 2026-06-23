import PropTypes from 'prop-types';

const OrderRecipeSnapshot = ({ item, compact = false }) => {
    const snapshot = item?.aiRecipeSnapshot;
    const ingredients = snapshot?.ingredients || [];

    if (!item?.isAIMixture || (!ingredients.length && !snapshot?.ratio)) {
        return null;
    }

    return (
        <div className={`mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 ${compact ? 'p-3' : 'p-4'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-emerald-900">Tỷ lệ AI Mix đóng hàng</p>
                {item.mixGoal && <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">{item.mixGoal}</span>}
            </div>

            {snapshot?.ratio && <p className="mt-2 text-sm text-emerald-800"><span className="font-bold">Tỷ lệ:</span> {snapshot.ratio}</p>}
            {snapshot?.useCase && <p className="mt-1 text-sm text-slate-600">{snapshot.useCase}</p>}

            {ingredients.length > 0 && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {ingredients.map((ingredient, index) => (
                        <div key={`${ingredient.name}-${index}`} className="rounded-xl bg-white p-3 text-sm">
                            <p className="font-bold text-slate-900">{ingredient.name}</p>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                                {ingredient.amount && <span>Lượng: {ingredient.amount}</span>}
                                {ingredient.role && <span>Vai trò: {ingredient.role}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

OrderRecipeSnapshot.propTypes = {
    item: PropTypes.shape({
        isAIMixture: PropTypes.bool,
        mixGoal: PropTypes.string,
        aiRecipeSnapshot: PropTypes.shape({
            ingredients: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                amount: PropTypes.string,
                role: PropTypes.string,
            })),
            ratio: PropTypes.string,
            useCase: PropTypes.string,
        }),
    }),
    compact: PropTypes.bool,
};

export default OrderRecipeSnapshot;
