const userService = require("../services/quizService");

exports.getQuestionsByLevel = async (req, res) => {
  try {
    const questions = await userService.getQuestionsByLevel(req.params.levelId);
    res.json(questions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while fetching questions" + err.message,
    });
  }
};

exports.postAnswerForValidation = async (req, res) => {
  try {
    const result = await userService.postAnswerForValidation(req.params.answerId);
    res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while validating the answer" + err.message,
    });
  }
};
