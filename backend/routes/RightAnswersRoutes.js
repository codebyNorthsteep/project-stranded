const express = require("express");
const router = express.Router();
const rightAnswerController = require("../controllers/RightAnswerscontroller");
const userMiddleware = require("../middleware/userMiddleware");

router.get(
  "/api/statistics/:user_id/correct-answers",
  userMiddleware.isLoggedIn,
  rightAnswerController.getCorrectAnswers
);

module.exports = router;