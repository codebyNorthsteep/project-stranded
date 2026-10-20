const statisticsService = require("../services/statisticsService");

exports.getCurrentQuestionForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentQuestion =
      await statisticsService.getCurrentQuestionForUser(userId);
    res.json(currentQuestion);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error:
        "An error occurred while fetching the current question for the user",
    });
  }
};
