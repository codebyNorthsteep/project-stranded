
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const userMiddleware = require('../middleware/userMiddleware');

// Define the route for getting all levels
router.get('/api/levels', quizController.getAllLevels);

// Define the route for getting questions by level
router.get('/api/levels/:levelId/questions', quizController.getQuestionsByLevel);
// Define the route for validating an answer
router.get('/api/answers/:answerId/validate', quizController.getAnswerValidation);

router.put('/api/users/statistics/current-question', userMiddleware.isLoggedIn, quizController.updateCurrentQuestion);



module.exports = router;
