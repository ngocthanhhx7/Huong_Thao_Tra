const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Ingredient = require('../models/Ingredient');
const Tea = require('../models/Tea');
const { ingredients, teas } = require('../data/traHoaVietCatalogData');

dotenv.config();

const buildIngredientPayload = (ingredient) => ({
    name: ingredient.name,
    description: ingredient.description || '',
    flavorProfile: ingredient.flavorProfile || [],
    benefits: ingredient.benefits || [],
    benefitsDetail: ingredient.benefitsDetail || '',
    caffeine: ingredient.caffeine ?? false,
    pricePerGram: ingredient.pricePerGram ?? 1,
    image: ingredient.image || '',
    appearance: ingredient.appearance || '',
    identification: ingredient.identification || '',
    precautions: ingredient.precautions || '',
    isUsedInAIMix: ingredient.isUsedInAIMix ?? true,
});

const importCatalog = async () => {
    const missingIngredientsByTea = [];

    try {
        await connectDB();

        const ingredientMap = new Map();

        for (const ingredient of ingredients) {
            const savedIngredient = await Ingredient.findOneAndUpdate(
                { name: ingredient.name },
                buildIngredientPayload(ingredient),
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );

            ingredientMap.set(savedIngredient.name, savedIngredient._id);
        }

        for (const tea of teas) {
            const missingIngredients = [];
            const ingredientIds = tea.ingredients
                .map((name) => {
                    const id = ingredientMap.get(name);

                    if (!id) {
                        missingIngredients.push(name);
                    }

                    return id;
                })
                .filter(Boolean);

            if (missingIngredients.length) {
                missingIngredientsByTea.push({
                    tea: tea.name,
                    missingIngredients,
                });
            }

            await Tea.findOneAndUpdate(
                { name: tea.name },
                {
                    name: tea.name,
                    description: tea.description,
                    price: tea.price,
                    image: tea.image,
                    ingredients: ingredientIds,
                    benefits: tea.benefits || [],
                    caffeineLevel: tea.caffeineLevel || 'None',
                    stock: tea.stock ?? 100,
                    rating: tea.rating ?? 0,
                    numReviews: tea.numReviews ?? 0,
                    isAIMixture: false,
                    mixGoal: tea.mixGoal || '',
                    isPublished: tea.isPublished ?? true,
                    source: 'catalog',
                },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
        }

        const importedTeaNames = teas.map((tea) => tea.name);
        const totalImportedTeas = await Tea.countDocuments({ name: { $in: importedTeaNames } });
        const totalImportedIngredients = await Ingredient.countDocuments({
            name: { $in: ingredients.map((ingredient) => ingredient.name) },
        });

        console.log('Imported Tra Hoa Viet catalog successfully.');
        console.log(`Ingredients upserted/verified: ${totalImportedIngredients}/${ingredients.length}`);
        console.log(`Teas upserted/verified: ${totalImportedTeas}/${teas.length}`);

        if (missingIngredientsByTea.length) {
            console.warn('Some teas referenced missing ingredients:');
            missingIngredientsByTea.forEach((item) => {
                console.warn(`- ${item.tea}: ${item.missingIngredients.join(', ')}`);
            });
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error(`Failed to import Tra Hoa Viet catalog: ${error.message}`);
        await mongoose.disconnect();
        process.exit(1);
    }
};

importCatalog();
