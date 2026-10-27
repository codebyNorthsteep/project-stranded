const connection = require("../connectionMySQL");

function getCorrectAnswersByLevel(userId) {
  const query = `
    SELECT
      l.level_id AS level_id,
      COUNT(DISTINCT CASE
        WHEN s.stat_id IS NOT NULL AND a.is_correct = TRUE THEN q.question_id
      END) AS correct_answers,
      COUNT(DISTINCT CASE
        WHEN s.stat_id IS NOT NULL AND a.is_correct = FALSE THEN q.question_id
      END) AS wrong_answers
    FROM level l
    LEFT JOIN questions q ON q.level_id = l.level_id
    LEFT JOIN answers a ON a.question_id = q.question_id
    LEFT JOIN statistics s
      ON s.answer_id = a.answer_id
      AND s.user_id = ?
    WHERE l.level_id IN (1, 2, 3)
    GROUP BY l.level_id
    ORDER BY l.level_id;
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