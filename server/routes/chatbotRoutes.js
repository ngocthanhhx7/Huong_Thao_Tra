const express = require('express');
const router = express.Router();
const { processMessage } = require('../controllers/chatbotController');

// Optional auth for saving history, using custom middleware or conditional check in controller
// The current implementation allows public usage but only saves if req.user exists.
// A softProtect middleware could be written, but for now we route it natively.
router.post('/message', processMessage);

module.exports = router;
