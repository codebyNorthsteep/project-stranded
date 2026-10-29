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

exports.updateCurrentQuestion = async (req, res) => {
  try {
    const userId = req.userData?.id;
    if (userId == null) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if(!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }

    const { questionId } = req.body;
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({ error: "questionId must be an integer" });
    }
    if (!questionId) {
      return res.status(400).json({ error: "questionId is required" });
    }

    const result = await userService.updateCurrentQuestion(userId, questionId);
    res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while updating the current question",
    });
  }
};
