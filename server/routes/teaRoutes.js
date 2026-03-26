const express = require('express');
const router = express.Router();
const {
    getTeas,
    getTeaById,
    createTea,
    updateTea,
    deleteTea,
} = require('../controllers/teaController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getTeas).post(protect, admin, createTea);
router.route('/:id').get(getTeaById).put(protect, admin, updateTea).delete(protect, admin, deleteTea);

module.exports = router;
