const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const userController = require('../controllers/userController');

// POST api/login route for user login
router.post('/api/login', userController.loginUser);

// POST api/login/google for user login with a google account
router.post('/api/login/google', userController.loginViaSocialLogin);

// POST api/register router for user register
router.post('/api/register', userController.registerUser);

// GET api/users/:userId route for fetching user info, initially added for dashboard welcome message, can be used for other purposes as well
router.get('/api/users/:userId', userMiddleware.isLoggedIn, userController.getUserInfo);

// PUT api/users/:userId route for update user info (username, password, picture)
router.put('/api/users/:userId', userMiddleware.isLoggedIn, userController.updateUser);

// DELETE /api/users/:userId route for delete an user account
router.delete('/api/users/:userId', userMiddleware.isLoggedIn, userController.deleteUser);

module.exports = router;