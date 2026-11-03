const statisticsServices = require("../services/RightAnswerServices");

async function getCorrectAnswers(req, res) {
    const userId = Number(req.params.user_id);
    const authenticatedUserId = Number(req.userData?.id);

    if (!Number.isInteger(userId) || userId < 1) {
        return res.status(401).json({ error: "Ogiltigt user_id." });
    }

    if (authenticatedUserId !== userId) {
        return res.status(403).json({ error: "Access denied." });
    }

    try{
        const correctQuestions =
            await statisticsServices.getCorrectAnswersByLevel(userId);

        return res.json({ correct_questions: correctQuestions });
    } catch (error) {
        console.error("fel vid hämtningen av data:", error);
        return res.status(500).json({error: "Ett problem uppstod vid hämtningen av statistik."});
    }
}
exports.getUserLevelStats = async (req, res) => {
  const userId = Number(req.params.userId);
  const authenticatedUserId = Number(req.userData?.id);

  if (!Number.isInteger(authenticatedUserId) || authenticatedUserId < 1) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  if (authenticatedUserId !== userId) {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const stats =
      await statisticsServices.getCorrectAnswersByLevel(userId);

    return res.json({ levels: stats });
  } catch (error) {
    console.error("Could not fetch user level stats:", error);
    return res.status(500).json({ error: "Could not fetch statistics." });
  }
};

module.exports = {
    getCorrectAnswers,
    getUserLevelStats: exports.getUserLevelStats,
};