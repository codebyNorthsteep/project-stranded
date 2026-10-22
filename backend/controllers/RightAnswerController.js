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

module.exports = {
    getCorrectAnswers,
};