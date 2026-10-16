const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST api/login route for user login
router.post('/api/login', userController.loginUser);
router.post('api/register', userController.registerUser);

module.exports = router;