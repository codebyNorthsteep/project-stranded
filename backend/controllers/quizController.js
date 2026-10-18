const userService = require("../services/quizService");

exports.getAllLevels = async (req, res) => {
  try {
    const levels = await userService.getAllLevels();
    res.json(levels);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while fetching levels",
    });
  }
};

exports.getQuestionsByLevel = async (req, res) => {
  try {
    const questions = await userService.getQuestionsByLevel(req.params.levelId);
    res.json(questions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while fetching questions",
    });
  }
};

exports.getAnswerValidation = async (req, res) => {
  try {
    const result = await userService.getAnswerValidation(req.params.answerId);
    res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while validating the answer",
    });
  }
};
