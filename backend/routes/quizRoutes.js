
const express = require('express');
const router = express.Router();
const userController = require('../controllers/quizController');

router.get('/api/levels/:levelId/questions', userController.getQuestionsByLevel);


module.exports = router;
