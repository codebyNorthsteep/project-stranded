const express = require("express");
const router = express.Router();
const rightAnswerController = require("../controllers/RightAnswerController");

router.get(
  "/api/statistics/:user_id/correct-answers",
  rightAnswerController.getCorrectAnswers
);

module.exports = router;