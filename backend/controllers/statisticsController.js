const statisticsService = require("../services/statisticsService");
const rightAnswerService = require("../services/RightAnswerServices");

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

exports.getLevelsStatistics = async (req, res) => {
  try {
    const authenticatedUserId = req.userData?.id;

    if (authenticatedUserId == null) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (String(req.params.userId) !== String(authenticatedUserId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const [answerCounts, currentQuestion] = await Promise.all([
      rightAnswerService.getCorrectAnswersByLevel(authenticatedUserId),
      statisticsService.getCurrentQuestionForUser(authenticatedUserId),
    ]);
    const currentLevelId = Number(currentQuestion?.current_level_id) || 1;
    const levels = [1, 2, 3].map((levelId) => {
      const savedCount = answerCounts.find(
        (item) => Number(item.level_id) === levelId,
      );

      return {
        level_id: levelId,
        correct_answers: Number(savedCount?.correct_answers ?? 0),
        wrong_answers: Number(savedCount?.wrong_answers ?? 0),
        unlocked: levelId <= currentLevelId,
      };
    });

    return res.json({ levels });
  } catch (err) {
    console.error("Error fetching level statistics:", err);
    return res.status(500).json({
      error: "An error occurred while fetching level statistics",
    });
  }
};
