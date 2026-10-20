const statisticsService = require("../services/statisticsService");

exports.getCurrentQuestionForUser = async (req, res) => {
  try {
    const authenticatedUserId = req.userData?.id;

    if (authenticatedUserId == null) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (String(req.params.userId) !== String(authenticatedUserId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const userId = authenticatedUserId;

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
