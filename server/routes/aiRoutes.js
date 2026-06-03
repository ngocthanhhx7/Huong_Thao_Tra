const express = require('express');
const router = express.Router();
const {
    aiMixTea,
    getAiHistory,
    saveAiMixTea,
    submitAiMixTeaForSale,
    buyAiMixTeaNow,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/mix-tea', aiMixTea); // Public or protect conditionally in controller
router.post('/mix-tea/save', protect, saveAiMixTea);
router.post('/mix-tea/buy-now', protect, buyAiMixTeaNow);
router.post('/mix-tea/:id/submit-for-sale', protect, submitAiMixTeaForSale);
router.get('/history', protect, getAiHistory);

module.exports = router;
