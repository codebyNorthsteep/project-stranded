
const express = require('express');
const router = express.Router();
const userController = require('../controllers/quizController');

// Define the route for getting questions by level
router.get('/api/levels/:levelId/questions', userController.getQuestionsByLevel);
// Define the route for validating an answer
router.post('/api/answers/:answerId/validate', userController.postAnswerForValidation);


module.exports = router;
