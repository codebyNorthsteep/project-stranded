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


exports.submitAnswer = async (req, res) => {
  const userId = Number(req.userData?.id);
  const questionId = Number(req.body?.questionId);
  const answerId = Number(req.params.answerId);

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  if (
    !Number.isInteger(questionId) ||
    questionId < 1 ||
    !Number.isInteger(answerId) ||
    answerId < 1
  ) {
    return res.status(400).json({
      error: "The question or answer ID is invalid.",
    });
  }

  try {
    const result = await statisticsService.saveAnswerAttempt(
      userId,
      questionId,
      answerId
    );

    if (result === null) {
      return res.status(400).json({
        error: "This answer does not belong to this question.",
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("Could not save answer:", error);
    return res.status(500).json({
      error: "Could not save the answer.",
    });
  }
};

exports.getUserStatisticsLog = async (req, res) => {
  const userId = Number(req.userData?.id);

  if  (!Number.isInteger(userId) || userId < 1) {
    return res.status(401).json({ error: "You must be logged in." });
  }
  if(String(req.params.userId) !== String(userId)) {
    return res.status(403).json({ error: "Access denied." });
  }
  try {
    const statisticsLog = 
      await statisticsService.getUserStatisticsLog(userId);    
    return res.json({ statistics_log: statisticsLog });
  } catch (error) {
    console.error("Could not fetch user statistics log:", error);
    return res.status(500).json({
      error: "Could not fetch user statistics log.",
    });
  }
};




exports.getLevelsStatistics = async (req, res) => {
  const userId = Number(req.userData?.id);

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  if (String(req.params.userId) !== String(userId)) {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const levels = await statisticsService.getCorrectAnswersByLevel(userId);
    return res.json({ levels });
  } catch (error) {
    console.error("Could not fetch level statistics:", error);
    return res.status(500).json({ error: "Could not fetch statistics." });
  }
};

exports.getCorrectAnswers = async (req, res) => {
  const userId = Number(req.params.user_id);
  const authenticatedUserId = Number(req.userData?.id);

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ error: "Ogiltigt user_id." });
  }

  if (authenticatedUserId !== userId) {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const levels = await statisticsService.getCorrectAnswersByLevel(userId);
    return res.json({ correct_questions: levels });
  } catch (error) {
    console.error("Fel vid hämtningen av statistik:", error);
    return res.status(500).json({
      error: "Ett problem uppstod vid hämtningen av statistik.",
    });
  }
};