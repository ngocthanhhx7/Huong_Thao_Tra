const express = require('express');
const router = express.Router();
const { aiMixTea, aiHealthPlan, getAiHistory } = require('../controllers/aiController');
const { protect, proPlan } = require('../middleware/authMiddleware');

router.post('/mix-tea', aiMixTea); // Public or protect conditionally in controller
router.post('/health-plan', protect, proPlan, aiHealthPlan); // Pro only
router.get('/history', protect, getAiHistory);

module.exports = router;
