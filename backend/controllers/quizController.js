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
