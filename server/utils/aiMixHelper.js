const AI_MIX_PRICE = 249000;

const normalizeText = (value = '') =>
    value
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

const normalizeCaffeineLevel = (value = '') => {
    const normalized = normalizeText(value);

    if (!normalized) return 'Low';
    if (['none', 'khong caffeine', 'khong cafein', 'no caffeine', 'decaf'].includes(normalized)) return 'None';
    if (['low', 'it caffeine', 'it cafein'].includes(normalized)) return 'Low';
    if (['medium', 'caffeine vua', 'cafein vua', 'vua caffeine', 'vua cafein'].includes(normalized)) return 'Medium';
    if (['high', 'nhieu caffeine', 'nhieu cafein', 'dam caffeine'].includes(normalized)) return 'High';

    return ['None', 'Low', 'Medium', 'High'].includes(value) ? value : 'Low';
};

const normalizeStringArray = (items) => (
    Array.isArray(items) ? items.map((item) => item?.toString?.() || '').filter(Boolean) : []
);

const buildAiRecipeSnapshot = (result = {}) => ({
    ingredients: (Array.isArray(result.ingredients) ? result.ingredients : [])
        .map((item) => {
            if (typeof item === 'string') {
                return { name: item, amount: '', role: '' };
            }

            return {
                name: item?.name || '',
                amount: item?.amount || '',
                role: item?.role || '',
            };
        })
        .filter((item) => item.name),
    ratio: result.ratio || '',
    brewSteps: normalizeStringArray(result.brewSteps),
    frequency: result.frequency || '',
    warnings: normalizeStringArray(result.warnings),
    useCase: result.useCase || '',
});

const getTeaId = (tea) => tea?._id || tea?.id || tea;

const buildOrderItemFromTea = ({ tea, cartItem = {}, qty }) => {
    const sourceTea = tea || cartItem.tea || {};
    const isAIMixture = Boolean(sourceTea.isAIMixture || cartItem.isAIMixture);
    const price = isAIMixture ? AI_MIX_PRICE : Number(sourceTea.price ?? cartItem.price ?? 0);

    return {
        name: sourceTea.name || cartItem.name,
        qty: Number(qty ?? cartItem.qty) || 1,
        image: sourceTea.image || cartItem.image,
        price,
        tea: getTeaId(sourceTea),
        isAIMixture,
        mixGoal: sourceTea.mixGoal || cartItem.mixGoal || '',
        aiRecipeSnapshot: isAIMixture
            ? buildAiRecipeSnapshot(sourceTea.aiRecipeSnapshot || cartItem.aiRecipeSnapshot || {})
            : undefined,
    };
};

module.exports = {
    AI_MIX_PRICE,
    normalizeCaffeineLevel,
    buildAiRecipeSnapshot,
    buildOrderItemFromTea,
};
