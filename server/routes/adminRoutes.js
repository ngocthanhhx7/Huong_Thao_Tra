const express = require('express');
const { protect, admin, staff } = require('../middleware/authMiddleware');
const {
    getAdminOverview,
    getUsers,
    updateUserRole,
} = require('../controllers/adminController');
const {
    getAdminPosts,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/postController');
const {
    getAdminFeedback,
    updateFeedback,
} = require('../controllers/feedbackController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { getAdminAiRecipes, approveAiRecipe } = require('../controllers/aiController');
const {
    getAdminTeas,
    updateAdminTea,
    getAdminIngredients,
    createAdminIngredient,
    updateAdminIngredient,
    deleteAdminIngredient,
    getAiMixConfig,
    updateAiMixConfig,
} = require('../controllers/catalogAdminController');
const { updateHomeSettings } = require('../controllers/homeSettingsController');

const router = express.Router();

router.get('/overview', protect, staff, getAdminOverview);
router.route('/home-settings').put(protect, admin, updateHomeSettings);

router.get('/orders', protect, staff, getAllOrders);
router.patch('/orders/:id/status', protect, staff, updateOrderStatus);

router.get('/posts', protect, staff, getAdminPosts);
router.post('/posts', protect, staff, createPost);
router.put('/posts/:id', protect, staff, updatePost);
router.delete('/posts/:id', protect, staff, deletePost);

router.get('/feedback', protect, staff, getAdminFeedback);
router.patch('/feedback/:id', protect, staff, updateFeedback);

router.get('/ai-recipes', protect, staff, getAdminAiRecipes);
router.post('/ai-recipes/:id/approve', protect, staff, approveAiRecipe);
router.get('/teas', protect, admin, getAdminTeas);
router.patch('/teas/:id', protect, admin, updateAdminTea);
router.get('/ingredients', protect, admin, getAdminIngredients);
router.post('/ingredients', protect, admin, createAdminIngredient);
router.patch('/ingredients/:id', protect, admin, updateAdminIngredient);
router.delete('/ingredients/:id', protect, admin, deleteAdminIngredient);
router.get('/ai-mix-config', protect, admin, getAiMixConfig);
router.patch('/ai-mix-config', protect, admin, updateAiMixConfig);

router.get('/users', protect, admin, getUsers);
router.patch('/users/:id/role', protect, admin, updateUserRole);

module.exports = router;
