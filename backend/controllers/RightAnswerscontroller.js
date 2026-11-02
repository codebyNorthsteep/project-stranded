const statisticsServices = require("../services/RightAnswerServices");

async function getCorrectAnswers(req, res) {
    try{
        const userId = Number(req.params.user_id);

        if (!Number.isInteger(userId) || userId < 1) {
            return res.status(400).json({ error: "Ogiltigt user_id."});
        }

        const correctQuestions =
        await statisticsServices.getCorrectAnswers(userId);

    return res.json({ correct_questions: correctQuestions});
    } catch (error) {
        console.error("fel vid hämtningen av data:", error);
        return res.status(500).json({error: "Ett problem uppstod vid hämtningen av statistik."});
    }
}
exports.getUserLevelStats = async (req, res) => {
  const userId = Number(req.params.userId);

  if (req.userData?.id !== userId) {
    return res.status(403).json({ error: "Access denied" });
  }

  const stats = await statisticsService.getUserLevelStats(userId);

  return res.json({ levels: stats });
};

async function getUserStatisticsLog(req, res) {
  const userId = Number(req.userData?.id);

    if (!Number.isInteger(userId) || userId < 1) {
        return res.status(401).json({ error: "You must be logged in." });
    }
    if (String(req.params.userId) !== String(userId)) {
        return res.status(403).json({ error: "Access denied." });
    }

    const stats = 
    await statisticsServices.getUserStatisticsLog(userId);

    return res.json({ statistics_log: stats });
}
  

module.exports = {
    getCorrectAnswers,
    getUserStatisticsLog
};