const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST api/login route for user login
router.post('/api/login', userController.loginUser);

//POST api/register router for user register
router.post('/api/register', userController.registerUser);

// GET api/users/:userId route for fetching user info, initially added for dashboard welcome message, can be used for other purposes as well
router.get('/api/users/:userId', userController.getUserInfo);

module.exports = router;