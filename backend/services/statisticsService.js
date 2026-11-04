const connectionMySQL = require("./../connectionMySQL");
const {promisify}  = require ("util");

const query = promisify(connectionMySQL.query).bind(connectionMySQL);

function getCurrentQuestionForUser(userId) {
  return new Promise((resolve, reject) => {
    //Hämta den aktuella frågan för användaren och dess nivå från databasen med en left join mellan users_questions och questions tabellerna
    const sql = `select uq.current_question_id, uq.quiz_completed, q.level_id as current_level_id
     from users_questions uq
     left join questions q on uq.current_question_id = q.question_id 
     where uq.user_id = ?`;
    connectionMySQL.query(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows.length > 0 ? rows[0] : null);
    });
  });
}

async function saveAnswerAttempt(userId, questionId, answerId) {  const answerRows = await query(
     `SELECT is_correct
     FROM answers
     WHERE answer_id = ? AND question_id = ?`,
    [answerId, questionId],
  );

  if(answerRows.length ===0){
    return null;
  }

  await query(
    `INSERT INTO statistics (user_id, answer_id, answer_timestamp)
     VALUES (?, ?, CURRENT_TIMESTAMP)`,
     [userId,answerId],
  );

  return{
    is_correct: Boolean(answerRows[0].is_correct),
  };
  
}

async function getIncorrectAnswerCount(userId, questionId) {
  return query(
      `SELECT q.question_title, a.answer_text, a.answer_explanation,
            s.answer_timestamp
     FROM statistics s
     JOIN answers a ON a.answer_id = s.answer_id
     JOIN questions q ON q.question_id = a.question_id
     WHERE s.user_id = ? 
     AND a.is_correct = 0
     ORDER BY s.answer_timestamp DESC`,
    [userId]
  );
}

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
  getCurrentQuestionForUser,
  saveAnswerAttempt,
  getIncorrectAnswerCount,
  getCorrectAnswersByLevel,
  getUserStatisticsLog
};
