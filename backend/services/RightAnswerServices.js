
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

async function getUserStatisticsLog(userId) {
  const sql = `
    SELECT s.stat_id, s.answer_timestamp, a.is_correct, q.question_title, l.level_id, q.question_id
    FROM statistics s
    JOIN answers a ON s.answer_id = a.answer_id
    JOIN questions q ON a.question_id = q.question_id
    JOIN level l ON q.level_id = l.level_id
    WHERE s.user_id = ?
     ORDER BY s.answer_timestamp DESC, s.stat_id DESC
    LIMIT 3;
    `;

  return query(sql, [userId]);
}

module.exports = {
  getCorrectAnswersByLevel,
  getUserStatisticsLog
};
