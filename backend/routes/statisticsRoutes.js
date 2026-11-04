const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const userMiddleware = require('../middleware/userMiddleware');

router.get('/api/users/:userId/statistics/current-question', 
    userMiddleware.isLoggedIn, // Middleware för att kontrollera om användaren är inloggad
    statisticsController.getCurrentQuestionForUser);

router.get(
    '/api/users/:userId/statistics/levels',
    userMiddleware.isLoggedIn,
    statisticsController.getLevelsStatistics
);

router.post(
    '/api/answers/:answerId/submit',
    userMiddleware.isLoggedIn,
    statisticsController.submitAnswer
);

router.get(
    '/api/users/:userId/statistics/log/',
    userMiddleware.isLoggedIn,
    statisticsController.getUserStatisticsLog
);

router.get(
  "/api/statistics/:user_id/correct-answers",
  userMiddleware.isLoggedIn,
  statisticsController.getCorrectAnswers
);

module.exports = router;