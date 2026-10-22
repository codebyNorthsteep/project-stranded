const connection = require("../connectionMySQL");

function getCorrectAnswersByLevel(userId) {
  const query = `
    SELECT
      q.level_id AS level_id,
      COUNT(DISTINCT uqa.question_id) AS correct_answers
    FROM user_quiz_answers uqa
    JOIN questions q ON q.question_id = uqa.question_id
    WHERE uqa.user_id = ?
      AND uqa.is_correct = TRUE
      AND q.level_id IN (1, 2, 4)
    GROUP BY q.level_id
    ORDER BY q.level_id;
  `;

  return new Promise((resolve, reject) => {
    connection.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

module.exports = {
  getCorrectAnswersByLevel,
};