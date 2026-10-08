
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Define the route for getting questions by level
router.get('/api/levels/:levelId/questions', quizController.getQuestionsByLevel);
// Define the route for validating an answer
router.get('/api/answers/:answerId/validate', quizController.getAnswerValidation);


module.exports = router;
