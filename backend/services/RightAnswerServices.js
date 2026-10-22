const connection = require("../connectionMySQL");

function getCorrectAnswers(userId) {
    const query = `
      SELECT COUNT(DISTINCT a.question_id) AS correct_questions
    FROM statistics s
    JOIN answers a ON a.answer_id = s.answer_id
    WHERE s.user_id = ?
  AND a.is_correct = TRUE;
  `;
  return new Promise((resolve, reject) => {
    connection.query(query, [userId], (err, results) => {
        if (err){
            return reject(err);
        }

        resolve(results[0].correct_questions);
    });
    });
}

module.exports = {
    getCorrectAnswers,
};
