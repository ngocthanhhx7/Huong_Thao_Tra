const express = require('express');
const router = express.Router();
const {
    aiMixTea,
    aiHealthPlan,
    getAiHistory,
    saveAiMixTea,
    submitAiMixTeaForSale,
    buyAiMixTeaNow,
} = require('../controllers/aiController');
const { protect, proPlan } = require('../middleware/authMiddleware');

router.post('/mix-tea', aiMixTea); // Public or protect conditionally in controller
router.post('/mix-tea/save', protect, saveAiMixTea);
router.post('/mix-tea/buy-now', protect, buyAiMixTeaNow);
router.post('/mix-tea/:id/submit-for-sale', protect, submitAiMixTeaForSale);
router.post('/health-plan', protect, proPlan, aiHealthPlan); // Pro only
router.get('/history', protect, getAiHistory);

module.exports = router;
