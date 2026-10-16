const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST api/login route for user login
router.post('/api/login', userController.loginUser);

module.exports = router;