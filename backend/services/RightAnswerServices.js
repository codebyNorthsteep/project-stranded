
const connection = require("../connectionMySQL");
const { promisify } = require("util");

const query = promisify(connection.query).bind(connection);

async function getCorrectAnswersByLevel(userId) {
  const sql = `
    SELECT
      l.level_id,
      COUNT(CASE
        WHEN a.is_correct = TRUE THEN s.stat_id
      END) AS correct_answers,
      COUNT(CASE
        WHEN a.is_correct = FALSE THEN s.stat_id
      END) AS wrong_answers
    FROM level l
    LEFT JOIN questions q
      ON q.level_id = l.level_id
    LEFT JOIN answers a
      ON a.question_id = q.question_id
    LEFT JOIN statistics s
      ON s.answer_id = a.answer_id
      AND s.user_id = ?
    WHERE l.level_id IN (1, 2, 3)
    GROUP BY l.level_id
    ORDER BY l.level_id;
  `;

  return query(sql, [userId]);
}

module.exports = {
  getCorrectAnswersByLevel,
};
