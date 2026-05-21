const Order = require('../models/Order');
const Tea = require('../models/Tea');
const Ingredient = require('../models/Ingredient');

const PAID_ORDER_FILTER = { isPaid: true };

const getDashboardStats = async (req, res) => {
    try {
        const [orderSummary, totalOrders, totalTeas, lowStockTeas] = await Promise.all([
            Order.aggregate([
                { $match: PAID_ORDER_FILTER },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' },
                    },
                },
            ]),
            Order.countDocuments(PAID_ORDER_FILTER),
            Tea.countDocuments(),
            Tea.countDocuments({ stock: { $lte: 10 } }),
        ]);

        res.json({
            totalOrders,
            totalTeas,
            lowStockTeas,
            totalRevenue: orderSummary[0]?.totalRevenue || 0,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBestSellers = async (req, res) => {
    try {
        const bestSellers = await Order.aggregate([
            { $match: PAID_ORDER_FILTER },
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.tea',
                    unitsSold: { $sum: '$orderItems.qty' },
                    revenue: {
                        $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] },
                    },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { unitsSold: -1, revenue: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'teas',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'tea',
                },
            },
            { $unwind: '$tea' },
            {
                $project: {
                    _id: '$tea._id',
                    name: '$tea.name',
                    image: '$tea.image',
                    stock: '$tea.stock',
                    unitsSold: 1,
                    revenue: 1,
                    orderCount: 1,
                    source: '$tea.source',
                    isPublished: '$tea.isPublished',
                },
            },
        ]);

        res.json(bestSellers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getIngredientDemand = async (req, res) => {
    try {
        const ingredientDemand = await Order.aggregate([
            { $match: PAID_ORDER_FILTER },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'teas',
                    localField: 'orderItems.tea',
                    foreignField: '_id',
                    as: 'tea',
                },
            },
            { $unwind: '$tea' },
            { $unwind: '$tea.ingredients' },
            {
                $group: {
                    _id: '$tea.ingredients',
                    demandUnits: { $sum: '$orderItems.qty' },
                    relatedTeaNames: { $addToSet: '$tea.name' },
                },
            },
            { $sort: { demandUnits: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'ingredients',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'ingredient',
                },
            },
            { $unwind: '$ingredient' },
            {
                $project: {
                    _id: '$ingredient._id',
                    name: '$ingredient.name',
                    demandUnits: 1,
                    pricePerGram: '$ingredient.pricePerGram',
                    relatedTeaNames: 1,
                },
            },
        ]);

        res.json(ingredientDemand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRestockRecommendations = async (req, res) => {
    try {
        const [bestSellers, teas, ingredients] = await Promise.all([
            Order.aggregate([
                { $match: PAID_ORDER_FILTER },
                { $unwind: '$orderItems' },
                {
                    $group: {
                        _id: '$orderItems.tea',
                        unitsSold: { $sum: '$orderItems.qty' },
                    },
                },
            ]),
            Tea.find({}).select('name stock ingredients image'),
            Ingredient.find({}).select('name pricePerGram'),
        ]);

        const teaMap = new Map(teas.map((tea) => [tea._id.toString(), tea]));
        const ingredientScoreMap = new Map();
        const teaRecommendations = [];

        bestSellers.forEach((item) => {
            const tea = teaMap.get(item._id.toString());

            if (!tea) {
                return;
            }

            const stockRisk = item.unitsSold > 0 && tea.stock <= Math.max(10, Math.ceil(item.unitsSold * 0.5));

            if (stockRisk) {
                teaRecommendations.push({
                    _id: tea._id,
                    name: tea.name,
                    image: tea.image,
                    stock: tea.stock,
                    unitsSold: item.unitsSold,
                    recommendedRestock: Math.max(tea.stock + 20, item.unitsSold * 2),
                });
            }

            tea.ingredients.forEach((ingredientId) => {
                const key = ingredientId.toString();
                const currentScore = ingredientScoreMap.get(key) || 0;
                ingredientScoreMap.set(key, currentScore + item.unitsSold);
            });
        });

        const ingredientRecommendations = ingredients
            .map((ingredient) => ({
                _id: ingredient._id,
                name: ingredient.name,
                pricePerGram: ingredient.pricePerGram,
                demandScore: ingredientScoreMap.get(ingredient._id.toString()) || 0,
            }))
            .filter((ingredient) => ingredient.demandScore > 0)
            .sort((a, b) => b.demandScore - a.demandScore)
            .slice(0, 10);

        res.json({
            teaRecommendations: teaRecommendations.sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 10),
            ingredientRecommendations,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getBestSellers,
    getIngredientDemand,
    getRestockRecommendations,
};
