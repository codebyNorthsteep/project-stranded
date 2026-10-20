const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/api/users/:userId/statistics/current-question', statisticsController.getCurrentQuestionForUser);

module.exports = router;