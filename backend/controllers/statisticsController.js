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

exports.submitAnswer = async (req, res) => {
  const userId = Number(req.userData?.id);
  const questionId = Number(req.body.questionId);
  const answerId = Number(req.params.answerId);

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(401).json({ error: "Du måste vara inloggad." });
  }

  if (
    !Number.isInteger(questionId) ||
    questionId < 1 ||
    !Number.isInteger(answerId) ||
    answerId < 1
  ) {
    return res.status(400).json({ error: "Frågan eller svaret är ogiltigt." });
  }

  try {
    const result = await statisticsService.saveAnswerAttempt(
      userId,
      questionId,
      answerId,
    );

    if (result === null) {
      return res.status(400).json({
        error: "Svaret hör inte till den valda frågan.",
      });
    }

    return res.json(result);
  } catch (err) {
    console.error("Error saving quiz answer:", err);
    return res.status(500).json({
      error: "Ett fel uppstod när svaret skulle sparas.",
    });
  }
};
