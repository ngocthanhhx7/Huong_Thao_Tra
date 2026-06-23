const test = require('node:test');
const assert = require('node:assert/strict');

const {
    AI_MIX_PRICE,
    normalizeCaffeineLevel,
    buildAiRecipeSnapshot,
    buildOrderItemFromTea,
} = require('../utils/aiMixHelper');

test('normalizes Vietnamese caffeine choices into Tea schema enum values', () => {
    assert.equal(AI_MIX_PRICE, 249000);
    assert.equal(normalizeCaffeineLevel('Không caffeine'), 'None');
    assert.equal(normalizeCaffeineLevel('Ít caffeine'), 'Low');
    assert.equal(normalizeCaffeineLevel('Caffeine vừa'), 'Medium');
    assert.equal(normalizeCaffeineLevel('High'), 'High');
    assert.equal(normalizeCaffeineLevel('unknown value'), 'Low');
});

test('builds a packable AI recipe snapshot from an AI result', () => {
    const snapshot = buildAiRecipeSnapshot({
        teaName: 'Trà ngủ ngon',
        useCase: 'Dùng buổi tối',
        ingredients: [
            { name: 'Hoa cúc vàng', amount: '30%', role: 'Core Herb' },
            { name: 'Táo đỏ', amount: '20%', role: 'Flavor Herb' },
        ],
        ratio: '3:2',
        brewSteps: ['Ủ 7 phút'],
        frequency: '1 ly/ngày',
        warnings: ['Không dùng quá nhiều'],
    });

    assert.deepEqual(snapshot.ingredients, [
        { name: 'Hoa cúc vàng', amount: '30%', role: 'Core Herb' },
        { name: 'Táo đỏ', amount: '20%', role: 'Flavor Herb' },
    ]);
    assert.equal(snapshot.ratio, '3:2');
    assert.equal(snapshot.useCase, 'Dùng buổi tối');
    assert.deepEqual(snapshot.brewSteps, ['Ủ 7 phút']);
    assert.deepEqual(snapshot.warnings, ['Không dùng quá nhiều']);
});

test('snapshots AI recipe details into order items and forces AI mix price', () => {
    const tea = {
        _id: 'tea-1',
        name: 'Trà AI',
        image: 'tea.jpg',
        price: 299000,
        isAIMixture: true,
        mixGoal: 'Ngủ ngon',
        aiRecipeSnapshot: {
            ingredients: [{ name: 'Hoa cúc vàng', amount: '30%', role: 'Core Herb' }],
            ratio: '3 phần hoa cúc',
            brewSteps: ['Ủ 7 phút'],
            frequency: 'Buổi tối',
            warnings: [],
            useCase: 'Thư giãn',
        },
    };

    const item = buildOrderItemFromTea({ tea, qty: 2 });

    assert.equal(item.price, 249000);
    assert.equal(item.qty, 2);
    assert.equal(item.isAIMixture, true);
    assert.equal(item.mixGoal, 'Ngủ ngon');
    assert.deepEqual(item.aiRecipeSnapshot.ingredients, tea.aiRecipeSnapshot.ingredients);
});
